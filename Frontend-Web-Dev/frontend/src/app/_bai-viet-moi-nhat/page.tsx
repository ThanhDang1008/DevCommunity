import Link from "next/link";
import clsx from "clsx";
import { Metadata } from "next";
import { URL } from "@/constants/Common";

import Container from "@/components/layout/home/container";
import Footer from "@/components/layout/footer";
import Header from "@components/layout/header";
import NewsSlider from "@modules/post/news-slider";
import FeaturedTab from "@modules/post/featured-tab";
import Card from "@modules/post/Card.Sidebar";
import Sidebar from "@/components/layout/sidebar-post";
import LatestPosts from "@modules/post/LatestPosts";

import ScrollToTopButton from "@/components/ui/button/ScrollToTopButton";
import { metadataGlobal } from "@/config/seo";

import { randomContent } from "@/shared/utils/random-content";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Bài viết mới nhất",
  description: metadataGlobal.description,
  keywords: metadataGlobal.keywords,
  applicationName: metadataGlobal.applicationName,
  authors: metadataGlobal.authors,
  creator: metadataGlobal.creator,
  icons: metadataGlobal.icons,
  publisher: metadataGlobal.publisher,
  openGraph: {
    title: "Bài viết mới nhất",
    description: metadataGlobal.openGraph.description,
    images: metadataGlobal.openGraph.images,
    url: `${URL}/bai-viet-moi-nhat`,
    locale: metadataGlobal.openGraph.locale,
    siteName: metadataGlobal.openGraph.siteName,
    type: "website",
    alternateLocale: metadataGlobal.openGraph.alternateLocale,
  },
  twitter: {
    card: "summary_large_image",
    title: "Bài viết mới nhất",
    description: metadataGlobal.twitter.description,
  },
  alternates: {
    canonical: `${URL}/bai-viet-moi-nhat`,
    languages: {
      vi: `${URL}/bai-viet-moi-nhat`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Page({ params, searchParams }: Props) {
  const randomContentData = await randomContent();
  return (
    <>
      <Header />

      <Container>
        <div className="grid grid-cols-10 gap-6 py-8">
          <section className="col-span-10 sm:col-span-7 mx-auto h-screen overflow-y-auto">
            <h2
              className={clsx(
                "text-[#9d4edd] font-semibold text-3xl uppercase transition duration-300 ease-in-out mb-4",
                "hover:text-[#c77dff]"
              )}
            >
              <Link title="Bài viết mới nhất" href={`${URL}/bai-viet-moi-nhat`}>
                Bài viết gần đây
              </Link>
            </h2>
            <hr className="border-t border-[#6247aa] mb-6" />
            <LatestPosts/>
          </section>
          <div className="col-span-3 hidden sm:block">
            <div className="dark:bg-[#10002b]/50 p-4 rounded-lg shadow-lg dark:shadow-[#3c096c]/30">
              <Sidebar>
                <NewsSlider slug={["khoa-hoc-va-cong-nghe"]} />
                <div className="mt-6 rounded-lg">
                  <FeaturedTab />
                </div>
                <div className="mt-6">
                  <Card slug={[randomContentData[0]?.value || ""]} />
                </div>
                <div className="mt-6">
                  <Card slug={[randomContentData[1]?.value || ""]} />
                </div>
                <div className="mt-6">
                  <Card slug={[randomContentData[2]?.value || ""]} />
                </div>
              </Sidebar>
            </div>
          </div>
        </div>
      </Container>
      {/* <Footer /> */}
      <ScrollToTopButton />
    </>
  );
}
