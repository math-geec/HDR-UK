import useSWR, { SWRConfiguration } from "swr";
import { bc } from "./broadcast";

export const fetcher = (url: string) =>
  fetch(process.env.NEXT_PUBLIC_API_URL + url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
});

export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 0, // we'll handle instant updates via BroadcastChannel
};
