import { MetadataRoute } from "next";
import { URL } from "@/constants/Common";

const CLIENT_URL = URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/*", "/chu-de/*"],
      disallow: ["/manage/*", "/auth/*"],
    },
    sitemap: [`${CLIENT_URL}/seo/sitemaps/sitemap.xml`],
  };
}
