import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/adminpage/", "/api/", "/_next/"],
    },
    sitemap: "https://comatching.site/sitemap.xml",
  };
}
