import { bc } from "./broadcast";
import useSWR from "swr";
import { fetcher } from "./swr";
import { logger } from "./logger";

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
  try {
    const res = await fetch(`${API}/api/events/${eventId}/register`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to register");
    logger.info("User registered for event", { eventId });
    bc?.postMessage("events-updated");
  } catch (err: any) {
    logger.error("Register event failed", { eventId, error: err.message });
    throw err;
  }
}

// Leave event
export async function leaveEvent(eventId: number) {
  try {
    const res = await fetch(`${API}/api/events/${eventId}/leave`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to leave");
    logger.info("User left event", { eventId });
    bc?.postMessage("events-updated");
  } catch (err: any) {
    logger.error("Leave event failed", { eventId, error: err.message });
    throw err;
  }
}
