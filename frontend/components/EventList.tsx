"use client";

import { useEffect } from "react";
import { useEvents, registerEvent, leaveEvent } from "@/lib/api";
import { bc } from "@/lib/broadcast";
import { logger } from "@/lib/logger";
import { useToast } from "@/components/ToastProvider";

export default function EventList() {
  const { data: events, mutate, isLoading } = useEvents();
  const { show } = useToast();

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
                  const body = await registerEvent(event.id);
                  await mutate(); // instant local update
                  const cnt = body?.registration_count ?? null;
                  show('success', cnt !== null ? `Registered — ${cnt} registered` : 'Registered');
                } catch (err: any) {
                  logger.error('Register failed in UI', { eventId: event.id, error: err?.message });
                  const msg = err?.message || 'Failed to register';
                  if (msg.toLowerCase().includes('full')) {
                    show('error', 'Event is full — maximum members reached');
                  } else {
                    show('error', `Failed to register: ${msg}`);
                  }
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
                  const body = await leaveEvent(event.id);
                  await mutate();
                  const cnt = body?.registration_count ?? null;
                  show('success', cnt !== null ? `Left event — ${cnt} registered` : 'Left event');
                } catch (err: any) {
                  logger.error('Leave failed in UI', { eventId: event.id, error: err?.message });
                  const msg = err?.message || 'Failed to leave';
                  if (msg.toLowerCase().includes('no registrations') || msg.toLowerCase().includes('no registration')) {
                    show('error', "Can't leave — you're not registered for this event");
                  } else {
                    show('error', `Failed to leave: ${msg}`);
                  }
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
