import type { Metadata } from "next";
import { URL } from "@/constants/Common";

interface MetadataGlobal extends Metadata {
  applicationName: string;
  publisher: string;
  creator: string;
  authors: Array<{ name: string; url: string }>;
  keywords: string[];
  icons: {
    icon: string;
  };
  openGraph: {
    type: string;
    locale: string;
    url: string;
    siteName: string;
    title: string;
    description: string;
    alternateLocale: string[];
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
      type: string;
      secureUrl: string;
    }>;
  };
  robots: {
    index: boolean;
    follow: boolean;
  };
  alternates: {
    canonical: string;
    languages: Record<string, string>;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
  };
}

export const metadataGlobal: MetadataGlobal = {
  title: "Dev Community | devlogik.minwandev.io.vn",
  description: `A personal website sharing web development projects, programming tutorials, and insights by Devlogik.`,
  applicationName: "devlogik.minwandev.io.vn",
  publisher: "Devlogik",
  creator: "Devlogik",
  authors: [
    {
      name: "Devlogik",
      url: "https://devlogik.minwandev.io.vn",
    },
  ],
  keywords: [
    "web development",
    "programming",
    "tutorials",
    "devlogik",
    "devlogik.minwandev.io.vn",
    "personal website",
    "developer portfolio",
    "software engineering",
  ],
  icons: {
    icon: `${URL!}/icon.png`,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: URL! as string,
    siteName: "Dev Community | devlogik.minwandev.io.vn",
    title: "Dev Community | devlogik.minwandev.io.vn",
    description:
      "A personal website sharing web development projects, programming tutorials, and insights by devlogik.minwandev.io.vn.",
    alternateLocale: ["vi_VN"],
    images: [
      {
        url: `${URL!}/image/minwandev.png`,
        width: 800,
        height: 600,
        alt: "Minwan Dev",
        type: "image/png",
        secureUrl: `${URL!}/image/minwandev.png`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: URL! as string,
    languages: {
      vi: URL! as string,
    },
  },
  //manifest: `/manifest.json`,
  twitter: {
    card: "summary_large_image",
    title: "Dev Community | devlogik.minwandev.io.vn",
    description: `A personal website sharing web development projects, programming tutorials, and insights by devlogik.minwandev.io.vn.`,
    images: [`${URL!}/icon.png`],
  },
  //Document has a valid rel=canonical
};
