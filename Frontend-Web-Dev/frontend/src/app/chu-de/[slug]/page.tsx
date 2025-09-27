import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { timeSince } from "@/shared/utils/time";
import { getAllPostByCategoryPublicNext } from "@/service/api/post";
import { getDetailTagBySlugNext } from "@/service/api/tag";
import { URL } from "@/constants/Common";

import Container from "@/components/layout/home/container";
import Footer from "@/components/layout/footer";
import Header from "@components/layout/header";
import PaginationCategory from "./pagination";

import LazyLoadImage from "@/components/LazyLoadImage";
import ScrollToTopButton from "@/components/ui/button/ScrollToTopButton";
import AutoScrollToTop from "@components/AutoScrollToTop";
import NewsletterSubscription from "@components/NewsletterSubscription";

import { metadataGlobal } from "@/config/seo";

const getDetailTagBySlug = cache(getDetailTagBySlugNext);
const getAllPostByCategoryPublic = cache(getAllPostByCategoryPublicNext);

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const response = await getDetailTagBySlug([`${(await params).slug}`]);
  const dataTag = response?.data?.data;

  if (response.status !== 200) {
    return {
      title: "Không tìm thấy chủ đề",
      description: "Không tìm thấy chủ đề",
    };
  }
  return {
    title: dataTag[0]?.name,
    description:
      dataTag[0]?.description ||
      `Xem các bài viết mới nhất về ${dataTag[0]?.name} từ ${metadataGlobal.applicationName}`,
    keywords: [`${dataTag[0]?.name}`, ...metadataGlobal.keywords],
    applicationName: metadataGlobal.applicationName,
    authors: metadataGlobal.authors,
    creator: metadataGlobal.creator,
    icons: metadataGlobal.icons,
    publisher: metadataGlobal.publisher,
    openGraph: {
      title: dataTag[0]?.name,
      description:
        dataTag[0]?.description ||
        `Xem các bài viết mới nhất về ${dataTag[0]?.name} từ ${metadataGlobal.applicationName}`,
      images: metadataGlobal.openGraph.images,
      url: `${URL}/chu-de/${dataTag[0]?.slug}`,
      locale: metadataGlobal.openGraph.locale,
      siteName: metadataGlobal.openGraph.siteName,
      type: "website",
      alternateLocale: metadataGlobal.openGraph.alternateLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: dataTag[0]?.name,
      description:
        dataTag[0]?.description ||
        `Xem các bài viết mới nhất về ${dataTag[0]?.name} từ ${metadataGlobal.applicationName}`,
    },
    alternates: {
      canonical: `${URL}/chu-de/${dataTag[0]?.slug}`,
      languages: {
        vi: `${URL}/chu-de/${dataTag[0]?.slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const PAGE_POST_CATEGORIES = Number((await searchParams)?.p) || 1;
  const LIMIT_POST_CATEGORIES = 20;

  let dataPost = null;
  let dataTag = null;
  const slug = (await params).slug;

  let currentPage = Number((await searchParams)?.p) || 1;
  let totalPages = 0;
  let totalPosts = 0;

  try {
    const response = await getAllPostByCategoryPublic(
      PAGE_POST_CATEGORIES,
      LIMIT_POST_CATEGORIES,
      [`${slug}`]
    );
    if (response.status === 200) {
      dataPost = response?.data?.data;
      currentPage = response.data.currentPage;
      totalPages = response.data.totalPages;
      totalPosts = response.data.totalPosts;
    }
  } catch (error) {}

  try {
    const response = await getDetailTagBySlug([`${slug}`]);
    if (response.status === 200) {
      dataTag = response?.data?.data;
    }
  } catch (error) {}

  if (!dataPost || !dataTag) {
    return notFound();
  }

  return (
    <div className="min-h-screen custom-bg-light-container dark:custom-bg-dark-container">
      <Header />

      <Container>
        {dataTag && dataTag.length > 0 && (
          <nav
            className={clsx(
              "border-b mb-7",
              "border-purple-300 dark:border-purple-800"
            )}
          >
            <div className="container mx-auto">
              <ul className="flex flex-wrap">
                <li key={`${dataTag[0]?.slug}`} className="flex items-center">
                  <Link
                    href={`${URL}/chu-de/${dataTag[0]?.slug}`}
                    className={clsx(
                      "px-3 py-4 hover:text-purple-600 dark:hover:text-purple-400 transition-colors",
                      "text-gray-900 dark:text-white font-semibold text-3xl",
                      "border-b-2 border-purple-600 dark:border-purple-500"
                    )}
                  >
                    {dataTag[0]?.name}
                  </Link>
                </li>
                {dataTag[0]?.child &&
                  dataTag[0]?.child.map((item, index) => {
                    return (
                      <li key={index} className="flex items-center">
                        <Link
                          href={`${URL}/chu-de/${slug}/${item.slug}`}
                          className={clsx(
                            "px-3 py-4 transition-colors",
                            "text-gray-600 hover:text-purple-600",
                            "dark:text-gray-300 dark:hover:text-purple-400"
                          )}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </nav>
        )}

        {dataPost && dataPost.length > 0 && (
          <section className="mx-auto">
            <div className="space-y-4">
              {dataPost.map((data, index) => (
                <div
                  key={index}
                  className={clsx(
                    "flex flex-col sm:flex-row gap-4 border-b rounded-lg overflow-hidden transition-all duration-300",
                    "border-purple-200 bg-purple-50 hover:bg-purple-100",
                    "dark:border-purple-900/50 dark:bg-purple-900/20 dark:hover:bg-purple-900/30"
                  )}
                >
                  <div className="flex-shrink-0 sm:w-1/4">
                    <Link
                      title={data.description}
                      href={`${URL}/${data.slug}`}
                      className="block overflow-hidden"
                    >
                      <LazyLoadImage
                        height={"h-44 sm:h-40"}
                        width={"w-full"}
                        options={{
                          src: data.thumbnail,
                          alt: data.description,
                          width: 100,
                          height: 100,
                          className:
                            "h-44 sm:h-40 w-full object-cover hover:opacity-80 transition duration-200 rounded-l-lg",
                          loading: "lazy",
                        }}
                      />
                    </Link>
                  </div>
                  <div className="sm:w-3/4 flex flex-col justify-between p-4">
                    <div>
                      <Link title={data.title} href={`${URL}/${data.slug}`}>
                        <h3
                          className={clsx(
                            "text-lg font-semibold mb-2 line-clamp-3 transition duration-200",
                            "text-gray-900 hover:text-purple-600",
                            "dark:text-white dark:hover:text-purple-300"
                          )}
                        >
                          {data.title}
                        </h3>
                      </Link>

                      <p
                        className={clsx(
                          "text-sm line-clamp-4",
                          "text-gray-600 dark:text-gray-300"
                        )}
                      >
                        {data.description}
                      </p>

                      <div className="flex items-center mt-3">
                        <span
                          className={clsx(
                            "text-xs",
                            "text-purple-600 dark:text-purple-300"
                          )}
                        >
                          {timeSince(data.createdAt)}
                        </span>
                        {/* {data.tags && data.tags.length > 0 && (
                          <div className="ml-auto flex gap-2">
                            {data.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className={clsx(
                                "px-2 py-1 text-xs rounded-full",
                                "bg-purple-200 text-purple-700",
                                "dark:bg-purple-800/50 dark:text-purple-200"
                              )}>
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center align-items-center mt-6 pb-7">
              <PaginationCategory
                slug={slug}
                totalPosts={totalPosts}
                limitPostCategory={LIMIT_POST_CATEGORIES}
                pagePostCategory={PAGE_POST_CATEGORIES}
                currentPage={currentPage}
              />
            </div>
          </section>
        )}

        {dataPost && dataPost.length === 0 && (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1
              className={clsx(
                "text-2xl font-bold mb-4",
                "text-gray-900 dark:text-white"
              )}
            >
              Không có bài viết nào
            </h1>
            <p className={clsx("text-gray-600 dark:text-gray-300")}>
              Chủ đề này hiện không có bài viết nào.
            </p>
          </div>
        )}
        <div className="mt-8" />
        <NewsletterSubscription />
      </Container>
      <Footer />
      <AutoScrollToTop />
      <ScrollToTopButton />
    </div>
  );
}
