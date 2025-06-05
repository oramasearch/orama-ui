export interface CustomEventLog {
  id: string;
  type: string;
  detail: any;
  timestamp: Date;
  source?: string;
}

class EventLoggerService {
  private logs: CustomEventLog[] = [];
  private listeners: ((logs: CustomEventLog[]) => void)[] = [];
  private isListening = false;

  startListening() {
    if (this.isListening) return;

    this.isListening = true;

    // Override dispatchEvent to capture custom events
    const originalDispatchEvent = EventTarget.prototype.dispatchEvent;

    EventTarget.prototype.dispatchEvent = function (event: Event) {
      // Only log custom events (not native browser events)
      if (
        event.type &&
        !event.type.startsWith("mouse") &&
        !event.type.startsWith("key") &&
        !event.type.startsWith("click") &&
        !event.type.startsWith("focus") &&
        !event.type.startsWith("blur") &&
        !event.type.startsWith("input") &&
        !event.type.startsWith("change") &&
        !event.type.startsWith("scroll") &&
        !event.type.startsWith("resize")
      ) {
        const customEvent = event as CustomEvent;
        const log: CustomEventLog = {
          id: Math.random().toString(36).substr(2, 9),
          type: event.type,
          detail: customEvent.detail || {},
          timestamp: new Date(),
          source: this.constructor.name || "Unknown",
        };

        eventLogger.addLog(log);
      }

      return originalDispatchEvent.call(this, event);
    };
  }

  stopListening() {
    this.isListening = false;
    // Note: In a real app, you'd want to restore the original dispatchEvent
  }

  addLog(log: CustomEventLog) {
    this.logs.unshift(log);
    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }
    this.notifyListeners();
  }

  getLogs(): CustomEventLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    this.notifyListeners();
  }

  subscribe(listener: (logs: CustomEventLog[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.getLogs()));
  }
}

export const eventLogger = new EventLoggerService();
