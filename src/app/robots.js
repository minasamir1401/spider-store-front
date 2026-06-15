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
    sitemap: "https://spider-store.vercel.app/sitemap.xml",
  };
}
