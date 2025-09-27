import type { MetadataRoute } from "next";
import {URL} from "@/constants/Common"

const CLIENT_URL = URL

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${CLIENT_URL}/`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${CLIENT_URL}/chu-de`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
  ];
}
