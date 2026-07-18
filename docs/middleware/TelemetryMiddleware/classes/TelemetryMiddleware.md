[**Telemetry**](../../../README.md)

***

[Telemetry](../../../README.md) / [middleware/TelemetryMiddleware](../README.md) / TelemetryMiddleware

# Class: TelemetryMiddleware

Kernel middleware that records one span (and a counter) per processed event.

It stays platform-agnostic: it spans every `IncomingEvent` with its `type`, reads a
`statusCode` off the response only when present, and tags the outcome. Errors are recorded
and re-thrown — telemetry never swallows application errors.

## Constructors

### Constructor

> **new TelemetryMiddleware**(`dependencies`): `TelemetryMiddleware`

#### Parameters

##### dependencies

Auto-wired container services.

###### telemetry

[`ITelemetry`](../../../declarations/interfaces/ITelemetry.md)

#### Returns

`TelemetryMiddleware`

## Methods

### handle()

> **handle**(`event`, `next`): `Promise`\<`OutgoingResponse`\>

Wraps event handling with a telemetry span.

#### Parameters

##### event

`IncomingEvent`

The incoming event.

##### next

`NextMiddleware`\<`IncomingEvent`, `OutgoingResponse`\>

The next middleware.

#### Returns

`Promise`\<`OutgoingResponse`\>

The outgoing response.
