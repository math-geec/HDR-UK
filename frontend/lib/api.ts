import { bc } from "./broadcast";
import useSWR from "swr";
import { fetcher } from "./swr";

const API = process.env.NEXT_PUBLIC_API_URL;

// ----------------------
// Event endpoints
// ----------------------
export function useEvents() {
  return useSWR("/api/events", fetcher, {
    keepPreviousData: true,
  });
}

// Register user for an event
export async function registerEvent(eventId: number) {
  const res = await fetch(`${API}/api/events/${eventId}/register`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to register");
  bc?.postMessage("events-updated");
}

// Leave event
export async function leaveEvent(eventId: number) {
  const res = await fetch(`${API}/api/events/${eventId}/leave`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to leave");
  bc?.postMessage("events-updated");
}
