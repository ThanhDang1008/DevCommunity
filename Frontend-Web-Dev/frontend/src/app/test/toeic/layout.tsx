import type { Metadata } from "next";

import MainToeic from "@/app/test/toeic/MainToeic";
import { metadataGlobal } from "@/config/seo";
import { URL } from "@/constants/Common";

export const metadata: Metadata = {
  title: "Luyện thi TOEIC CTUET",
  description: `Luyện thi TOEIC online miễn phí, đề thi TOEIC chuẩn, luyện tập các kỹ năng Nghe, Đọc hiểu, Ngữ pháp.`,
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
    "luyện thi TOEIC",
    "đề thi TOEIC",
    "luyện tập TOEIC",
    "nghe hiểu TOEIC",
    "đọc hiểu TOEIC",
    "ngữ pháp TOEIC",
  ],
  icons: {
    icon: `${URL!}/image/trungtamnnth_ctuet.png`,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: URL! as string,
    siteName: "Luyện thi TOEIC CTUET",
    title: "Luyện thi TOEIC CTUET",
    description:
      "Luyện thi TOEIC online miễn phí, đề thi TOEIC chuẩn, luyện tập các kỹ năng Nghe, Đọc hiểu, Ngữ pháp.",
    alternateLocale: ["vi_VN"],
    images: [
      {
        url: `${URL!}/image/trungtamnnth_ctuet.png`,
        width: 800,
        height: 600,
        alt: "Trung tâm Ngoại ngữ - Tin học CTUET",
        type: "image/png",
        secureUrl: `${URL!}/image/trungtamnnth_ctuet.png`,
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
    title: "Luyện thi TOEIC CTUET",
    description: `Luyện thi TOEIC online miễn phí, đề thi TOEIC chuẩn, luyện tập các kỹ năng Nghe, Đọc hiểu, Ngữ pháp.`,
    images: [`${URL!}/image/trungtamnnth_ctuet.png`],
  },
  //Document has a valid rel=canonical
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainToeic>{children}</MainToeic>
    </>
  );
}
