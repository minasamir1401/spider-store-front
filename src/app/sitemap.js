import { SITE_URL } from "@/config";

export default async function sitemap() {
  const baseUrl = SITE_URL;

  // Static URLs
  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  ];

  // Static fallback category URLs - avoids build-time API fetch timeouts on Vercel
  // The sitemap is generated statically; dynamic IDs will update at runtime via revalidation
  const fallbackCategoryIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const categoryUrls = fallbackCategoryIds.map((id) => ({
    url: `${baseUrl}/category/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Static fallback service URLs
  const fallbackServiceIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const serviceUrls = fallbackServiceIds.map((id) => ({
    url: `${baseUrl}/service/${id}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [...staticUrls, ...categoryUrls, ...serviceUrls];
}

