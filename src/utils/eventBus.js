/**
 * AppEventBus - Lightweight Pub-Sub Event Bus Pattern
 * 
 * Decouples cross-cutting concerns (audio effects, analytics tracking, notifications)
 * from UI and Store state management.
 */

class EventBus {
  constructor() {
    this.listeners = new Map()
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name (e.g. 'AUDIO:PLAY', 'ANALYTICS:TRACK')
   * @param {Function} callback - Event handler
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event).add(callback)

    return () => this.off(event, callback)
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Event handler to remove
   */
  off(event, callback) {
    const handlers = this.listeners.get(event)
    if (handlers) {
      handlers.delete(callback)
      if (handlers.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  /**
   * Emit an event to all subscribers
   * @param {string} event - Event name
   * @param {*} data - Payload passed to subscribers
   */
  emit(event, data) {
    const handlers = this.listeners.get(event)
    if (handlers) {
      handlers.forEach((cb) => {
        try {
          cb(data)
        } catch (err) {
          console.error(`[EventBus] Error in handler for "${event}":`, err)
        }
      })
    }
  }

  /**
   * Remove all listeners
   */
  clear() {
    this.listeners.clear()
  }
}

export const eventBus = new EventBus()

// Standard Event Type Constants
export const APP_EVENTS = {
  AUDIO_PLAY: 'AUDIO:PLAY',
  ANALYTICS_TRACK: 'ANALYTICS:TRACK',
  TOAST_SHOW: 'TOAST:SHOW',
}

/**
 * Convenience helper to emit audio sound playback
 * @param {string} soundName
 */
export const emitSound = (soundName) => {
  eventBus.emit(APP_EVENTS.AUDIO_PLAY, soundName)
}

/**
 * Convenience helper to emit analytics tracking
 * @param {string} eventName
 * @param {object} [properties]
 */
export const emitAnalytics = (eventName, properties) => {
  eventBus.emit(APP_EVENTS.ANALYTICS_TRACK, { name: eventName, properties })
}

export default eventBus

