"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/Button";
import { ScrollArea } from "@/components/ScrollArea";
import { Badge } from "@/components/Badge";
import { eventLogger, CustomEventLog } from "@/services/eventLogger";

export const EventLoggerPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [logs, setLogs] = useState<CustomEventLog[]>([]);

  useEffect(() => {
    const unsubscribe = eventLogger.subscribe(setLogs);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isListening) {
      eventLogger.startListening();
    } else {
      eventLogger.stopListening();
    }
  }, [isListening]);

  const togglePanel = () => setIsOpen(!isOpen);

  const toggleListening = () => setIsListening(!isListening);

  const clearLogs = () => eventLogger.clearLogs();

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString();
  };

  const formatDetail = (detail: any) => {
    if (typeof detail === "object" && detail !== null) {
      return JSON.stringify(detail, null, 2);
    }
    return String(detail);
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={togglePanel}
        className="fixed top-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        size="sm"
      >
        {isOpen ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
        Events
      </Button>

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Event Logger
              </h2>
              <Button
                onClick={togglePanel}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={toggleListening}
                size="sm"
                variant={isListening ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isListening ? (
                  <>
                    <Pause className="w-3 h-3" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    Start
                  </>
                )}
              </Button>

              <Button
                onClick={clearLogs}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </Button>

              <Badge variant={isListening ? "default" : "secondary"}>
                {logs.length} events
              </Badge>
            </div>
          </div>

          {/* Event List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {logs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  {isListening ? (
                    <p>Listening for custom events...</p>
                  ) : (
                    <p>Click &quot;Start&quot; to begin logging events</p>
                  )}
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {log.type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>

                    {log.source && (
                      <div className="text-xs text-gray-600 mb-2">
                        Source: {log.source}
                      </div>
                    )}

                    {log.detail && Object.keys(log.detail).length > 0 && (
                      <div className="bg-white p-2 rounded border text-xs max-w-full">
                        <div className="font-medium text-gray-700 mb-1">
                          Detail:
                        </div>
                        <pre className="text-gray-600 whitespace-pre-wrap_ overflow-x-auto">
                          {formatDetail(log.detail)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default EventLoggerPanel;
