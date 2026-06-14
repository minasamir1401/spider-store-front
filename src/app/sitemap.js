import { API_BASE_URL } from "@/config";

export default async function sitemap() {
  const baseUrl = "https://spider-store.duckdns.org";

  // Static URLs
  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  ];

  let categoryUrls = [];
  let serviceUrls = [];

  try {
    // Fetch categories with short revalidate so it updates frequently
    const catRes = await fetch(`${API_BASE_URL}/api/categories`, { next: { revalidate: 3600 } });
    if (catRes.ok) {
      const categories = await catRes.json();
      categoryUrls = categories.map((cat) => ({
        url: `${baseUrl}/category/${cat.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("Failed to fetch categories for sitemap:", err);
    // Fallback static categories
    const fallbackIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    categoryUrls = fallbackIds.map((id) => ({
      url: `${baseUrl}/category/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  }

  try {
    // Fetch services
    const servRes = await fetch(`${API_BASE_URL}/api/services`, { next: { revalidate: 3600 } });
    if (servRes.ok) {
      const services = await servRes.json();
      serviceUrls = services.map((service) => ({
        url: `${baseUrl}/service/${service.id}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      }));
    }
  } catch (err) {
    console.error("Failed to fetch services for sitemap:", err);
    // Fallback static services
    const fallbackIds = [1, 2, 3, 4, 5, 6, 7];
    serviceUrls = fallbackIds.map((id) => ({
      url: `${baseUrl}/service/${id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }));
  }

  return [...staticUrls, ...categoryUrls, ...serviceUrls];
}
