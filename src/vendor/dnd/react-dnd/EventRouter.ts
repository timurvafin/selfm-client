import { Event } from './constants';


type Unsubsribe = () => void;

export default class EventRouter {
  handlers: {
    [eventType: string]: Map<string, any>;
  } = {};

  addHandler(eventType: Event, handler): Unsubsribe {
    const id = Math.random().toString(36).slice(2);

    if (!this.handlers[eventType]) {
      this.handlers[eventType] = new Map();
    }

    this.handlers[eventType].set(id, handler);

    return () => this.removeHandler(eventType, id);
  }

  removeHandler(eventType: Event, id) {
    if (this.handlers[eventType]) {
      this.handlers[eventType].delete(id);
    }
  }

  fire(eventType: Event, payload?: any) {
    const handlers = this.handlers[eventType];

    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }
}