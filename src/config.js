let apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === "production" ? "https://spider-store-api.duckdns.org" : "http://localhost:5000");

if (typeof window !== "undefined") {
  if (process.env.NEXT_PUBLIC_API_URL) {
    apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  } else {
    const host = window.location.hostname;
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      apiBaseUrl = "http://localhost:5000";
    } else if (host.includes("spider-store.vercel.app")) {
      apiBaseUrl = "https://spider-store-api.duckdns.org";
    } else {
      // If deployed elsewhere or custom domain, default to the production backend
      apiBaseUrl = "https://spider-store-api.duckdns.org";
    }
  }
}

export const API_BASE_URL = apiBaseUrl;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://spider-store.vercel.app";

export async function fetchWithTimeout(url, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

