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
    const body = typeof (res as any).json === "function" ? await (res as any).json().catch(() => null) : null;
    if (!res.ok) {
      const msg = body?.error || "Failed to register";
      logger.error("Register event failed", { eventId, status: res.status, error: msg });
      const err = new Error(msg);
      // attach status for UI to handle specific cases
      (err as any).status = res.status;
      throw err;
    }
    logger.info("User registered for event", { eventId });
    bc?.postMessage("events-updated");
    return body;
  } catch (err: any) {
    logger.error("Register event failed", { eventId, error: err.message });
    throw err;
  }
}

// Leave event
export async function leaveEvent(eventId: number) {
  try {
    const res = await fetch(`${API}/api/events/${eventId}/leave`, { method: "POST" });
    const body = typeof (res as any).json === "function" ? await (res as any).json().catch(() => null) : null;
    if (!res.ok) {
      const msg = body?.error || "Failed to leave";
      logger.error("Leave event failed", { eventId, status: res.status, error: msg });
      const err = new Error(msg);
      (err as any).status = res.status;
      throw err;
    }
    logger.info("User left event", { eventId });
    bc?.postMessage("events-updated");
    return body;
  } catch (err: any) {
    logger.error("Leave event failed", { eventId, error: err.message });
    throw err;
  }
}
