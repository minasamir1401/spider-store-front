export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/orders/",
        "/wallet/"
      ],
    },
    sitemap: "https://spider-store.duckdns.org/sitemap.xml",
  };
}
