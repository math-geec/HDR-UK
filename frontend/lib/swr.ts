import { SWRConfiguration } from "swr";
import { logger } from "./logger";

export const fetcher = async (url: string) => {
  const full = `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  try {
    logger.info("Fetching", { url: full });
    const res = await fetch(full);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      logger.error("Fetch failed", { url: full, status: res.status, body: text });
      throw new Error("Failed to fetch");
    }
    const data = await res.json();
    logger.info("Fetch success", { url: full });
    return data;
  } catch (err: any) {
    logger.error("Fetcher error", { url: full, error: err?.message });
    throw err;
  }
};

export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 0, // we'll handle instant updates via BroadcastChannel
};
