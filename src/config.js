let apiBaseUrl = "https://api.arab-tech1.online";

if (typeof window !== "undefined") {
  const host = window.location.hostname;
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    apiBaseUrl = "http://localhost:5000";
  } else {
    apiBaseUrl = "https://api.arab-tech1.online";
  }
}

export const API_BASE_URL = apiBaseUrl;
export const SITE_URL = "https://arab-tech1.online";


