"use client";

import { useEffect } from "react";
import { useEvents, registerEvent, leaveEvent } from "@/lib/api";
import { bc } from "@/lib/broadcast";

export default function EventList() {
  const { data: events, mutate, isLoading } = useEvents();

  // Listen for "events-updated" message from other tabs
  useEffect(() => {
    if (!bc) return;

    bc.onmessage = (msg) => {
      if (msg.data === "events-updated") {
        mutate(); // instantly refresh event list
      }
    };

    return () => {
      bc.close();
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
                await registerEvent(event.id);
                mutate(); // instant local update
              }}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Register
            </button>

            <button
              onClick={async () => {
                await leaveEvent(event.id);
                mutate();
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
