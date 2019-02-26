import Amplitude from 'amplitude-js'

const instance = Amplitude.getInstance();
instance.init(process.env.AMPLITUDE_KEY)

export function logEvent(type, properties) {
  // In development, track when events are fired for debugging purposes.
  if (process.env.NODE_ENV === 'development') {
    console.log(`[METRICS]: "${type}", ${JSON.stringify(properties)}`)
  }
  instance.logEvent(type, properties)
}

const eventHandlers = []

export function addEventHandler(handler) {
  eventHandlers.push(handler)
}

export function broadcastEvent(state, action) {
  eventHandlers.forEach((handler) => {
    handler(state, action)
  })
}
