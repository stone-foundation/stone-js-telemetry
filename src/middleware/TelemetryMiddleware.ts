import { ITelemetry } from '../declarations'
import { IncomingEvent, NextMiddleware, OutgoingResponse } from '@stone-js/core'

/**
 * Kernel middleware that records one span (and a counter) per processed event.
 *
 * It stays platform-agnostic: it spans every `IncomingEvent` with its `type`, reads a
 * `statusCode` off the response only when present, and tags the outcome. Errors are recorded
 * and re-thrown — telemetry never swallows application errors.
 */
export class TelemetryMiddleware {
  private readonly telemetry: ITelemetry

  /**
   * @param dependencies - Auto-wired container services.
   */
  constructor ({ telemetry }: { telemetry: ITelemetry }) {
    this.telemetry = telemetry
  }

  /**
   * Wraps event handling with a telemetry span.
   *
   * @param event - The incoming event.
   * @param next - The next middleware.
   * @returns The outgoing response.
   */
  async handle (event: IncomingEvent, next: NextMiddleware<IncomingEvent, OutgoingResponse>): Promise<OutgoingResponse> {
    if (!this.telemetry.isEnabled()) {
      return await next(event)
    }

    const span = this.telemetry.startSpan('stone.event', { type: event.type })

    try {
      const response = await next(event)
      const statusCode = (response as { statusCode?: number })?.statusCode
      if (statusCode !== undefined) { span.setAttribute('statusCode', statusCode) }
      span.end('ok')
      this.telemetry.counter('stone.events.total', 1, { status: 'ok' })
      return response
    } catch (error: any) {
      span.recordError(error)
      span.end('error')
      this.telemetry.counter('stone.events.total', 1, { status: 'error' })
      throw error
    }
  }
}
