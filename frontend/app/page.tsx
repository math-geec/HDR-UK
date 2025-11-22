"use client";

import useSWR from "swr";
import { Event, fetchEvents, registerEvent, leaveEvent } from "./lib/api";

export default function Home() {
  const {
    data: events,
    mutate,
    isLoading,
    error,
  } = useSWR<Event[]>("events", fetchEvents);

  if (isLoading) return <p className="p-6 text-gray-600">Loading events...</p>;
  if (error) return <p className="p-6 text-red-500">Failed to load events.</p>;

  const handleRegister = async (id: number) => {
    // Optimistic update
    mutate(
      events?.map((e) =>
        e.id === id
          ? { ...e, registration_count: e.registration_count + 1 }
          : e
      ),
      false
    );

    await registerEvent(id);
    mutate(); // revalidate
  };

  const handleLeave = async (id: number) => {
    mutate(
      events?.map((e) =>
        e.id === id && e.registration_count > 0
          ? { ...e, registration_count: e.registration_count - 1 }
          : e
      ),
      false
    );

    await leaveEvent(id);
    mutate();
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Internal Event Registrations
      </h1>

      <div className="space-y-4">
        {events?.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow p-5 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {event.name}
            </h2>
            <p className="text-gray-600">Date: {event.date}</p>
            <p className="text-gray-700 font-medium mt-2">
              Registrations: {event.registration_count}
            </p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleRegister(event.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Register
              </button>
              <button
                onClick={() => handleLeave(event.id)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Leave
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
