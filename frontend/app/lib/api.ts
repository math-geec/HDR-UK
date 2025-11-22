export interface Event {
  id: number;
  name: string;
  date: string;
  registration_count: number;
}

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(`${BASE}/api/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function registerEvent(id: number): Promise<{ registration_count: number }> {
  const res = await fetch(`${BASE}/api/events/${id}/register`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to register");
  return res.json();
}

export async function leaveEvent(id: number): Promise<{ registration_count: number }> {
  const res = await fetch(`${BASE}/api/events/${id}/leave`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to leave");
  return res.json();
}
