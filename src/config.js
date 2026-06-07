let apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

if (typeof window !== "undefined") {
  if (process.env.NEXT_PUBLIC_API_URL) {
    apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  } else {
    const host = window.location.hostname;
    if (host.includes("spider-store.duckdns.org")) {
      apiBaseUrl = "https://spider-store-api.duckdns.org";
    } else {
      // If deployed elsewhere or custom domain, default to the production backend
      apiBaseUrl = "https://spider-store-api.duckdns.org";
    }
  }
}

export const API_BASE_URL = apiBaseUrl;
