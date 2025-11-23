export const bc =
  typeof window !== "undefined"
    ? new BroadcastChannel("event-sync")
    : null;
