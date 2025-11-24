"use client";

import { useEffect } from "react";
import { useEvents, registerEvent, leaveEvent } from "@/lib/api";
import { bc } from "@/lib/broadcast";
import { logger } from "@/lib/logger";

export default function EventList() {
  const { data: events, mutate, isLoading } = useEvents();

  // Listen for "events-updated" message from other tabs
  useEffect(() => {
    if (!bc) return;

    bc.onmessage = async (msg) => {
      logger.info("BroadcastChannel message received", { data: msg.data });
      if (msg.data === "events-updated") {
        try {
          await mutate(); // instantly refresh event list
          logger.info("Mutated events after broadcast");
        } catch (err: any) {
          logger.error("Failed to mutate events after broadcast", { error: err?.message });
        }
      }
    };

    return () => {
      bc?.close();
    };
  }, [mutate]);

  if (isLoading) return <p>Loading events…</p>;
  if (!events) return <p>No events found</p>;

  return (
    <div className="space-y-4">
      {events.map((event: any) => (
        <div key={event.id} className="p-4 border rounded shadow-sm flex justify-between items-center">
          
          <div>
            <h2 className="text-lg font-semibold">{event.name}</h2>
            <p className="text-sm text-gray-500">{event.date}</p>
            <p className="text-sm mt-1">
              Registrations: <strong>{event.registration_count}</strong>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  logger.info('Register button clicked', { eventId: event.id });
                  await registerEvent(event.id);
                  await mutate(); // instant local update
                } catch (err: any) {
                  logger.error('Register failed in UI', { eventId: event.id, error: err?.message });
                  // Minimal user feedback — can replace with a toast
                  alert('Failed to register for event: ' + (err?.message || 'unknown'));
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Register
            </button>

            <button
              onClick={async () => {
                try {
                  logger.info('Leave button clicked', { eventId: event.id });
                  await leaveEvent(event.id);
                  await mutate();
                } catch (err: any) {
                  logger.error('Leave failed in UI', { eventId: event.id, error: err?.message });
                  alert('Failed to leave event: ' + (err?.message || 'unknown'));
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Leave
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
