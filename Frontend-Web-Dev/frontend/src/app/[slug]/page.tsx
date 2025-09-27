import "@components/suneditor/parse/suneditor-parse.scss";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";

import ParseHTML from "@components/suneditor/parse";
import { getPostBySlugNext } from "@/service/api/post";
import Sidebar from "@/components/layout/sidebar-post";
import Conatainer from "@/components/layout/home/container";

// import Header from "@components/header";
import Header from "@components/layout/header";
import NewsletterSubscription from "@components/NewsletterSubscription";
// import HeaderContent from "@components/header/header-content";
// import Logo from "@components/header/logo";

import { formatToLocalDateTimePost } from "@/shared/utils/time";
import Categories from "@modules/tag/Categories";
import NewsSlider from "@modules/post/news-slider";
import FeaturedTab from "@modules/post/featured-tab";
import Card from "@modules/post/Card.Sidebar";

import IncreaseView from "@modules/post/IncreaseView/increase-view";
import SameCategories from "@modules/post/SameCategories";
import LatestNews from "@modules/post/LatestNews";
import Footer from "@/components/layout/footer";
import { TableOfContentsSlug } from "@components/ui/table/TableOfContentsSlug";

import { LayoutPostComments } from "@/modules/post/comments";
import { SidebarMenu } from "@modules/post/SidebarMenu";

import ScrollToTopButton from "@/components/ui/button/ScrollToTopButton";
import AutoScrollToTop from "@components/AutoScrollToTop";

import HorizontalScrollingFeaturedArticles from "@modules/post/HorizontalScrollingFeaturedArticles";

import { randomContent } from "@/shared/utils/random-content";
import { URL } from "@/constants/Common";
import { metadataGlobal } from "@/config/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const response = await getPostBySlugNext((await params).slug, true);
  const dataPost = response.data.data;
  if (response.status !== 200) {
    return {
      title: "Không tìm thấy bài viết",
      description: "Không tìm thấy bài viết",
    };
  }
  return {
    title: dataPost.title,
    description: dataPost.description,
    icons: {
      icon: dataPost.thumbnail,
    },
    publisher: dataPost?.author?.fullname || metadataGlobal.publisher,
    openGraph: {
      title: dataPost.title,
      description: dataPost.description,
      url: `${URL}/${dataPost.slug}`,
      locale: metadataGlobal.openGraph.locale,
      siteName: metadataGlobal.openGraph.siteName,
      type: "website",
      alternateLocale: metadataGlobal.openGraph.alternateLocale,
      images: [
        {
          url: dataPost.thumbnail,
          width: 800,
          height: 600,
          alt: dataPost.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dataPost.title,
      description: dataPost.description,
      images: [dataPost.thumbnail],
    },
    alternates: {
      canonical: `${URL}/${dataPost.slug}`,
      languages: {
        vi: `${URL}/${dataPost.slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: metadataGlobal.keywords,
    applicationName: metadataGlobal.applicationName,
    authors: [
      {
        name: dataPost?.author?.fullname || metadataGlobal.authors[0].name,
        url: URL,
      },
    ],
    creator: dataPost?.author?.fullname || metadataGlobal.creator,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let dataPost = null;
  //console.log("dataPost", dataPost);
  try {
    const response = await getPostBySlugNext((await params).slug, false);
    if (response.status === 200) {
      dataPost = response.data.data;
    }
  } catch (error) {}

  if (!dataPost) {
    notFound();
  }

  //------------------------- random post -------------------------
  const randomContentData = await randomContent();

  const getRandomHoverGradient = (index: number) => {
    // Chỉ hiện nền khi hover
    const hoverGradients = [
      "hover:from-[#a18cd1] hover:to-[#fbc2eb] hover:text-[#6a0572]", // purple to pink
      "hover:from-[#f7971e] hover:to-[#ffd200] hover:text-[#b06a00]", // orange to yellow
      "hover:from-[#43e97b] hover:to-[#38f9d7] hover:text-[#0b8457]", // green to teal
      "hover:from-[#667eea] hover:to-[#764ba2] hover:text-[#3b3b98]", // blue to purple
      "hover:from-[#ff5858] hover:to-[#f09819] hover:text-[#b71c1c]", // red to orange
      "hover:from-[#30cfd0] hover:to-[#330867] hover:text-[#145374]", // teal to dark blue
      "hover:from-[#f953c6] hover:to-[#b91d73] hover:text-[#7b1fa2]", // pink to magenta
      "hover:from-[#43cea2] hover:to-[#185a9d] hover:text-[#185a9d]", // green to blue
      "hover:from-[#fa709a] hover:to-[#fee140] hover:text-[#c44569]", // pink to yellow
      "hover:from-[#4e54c8] hover:to-[#8f94fb] hover:text-[#22223b]", // blue to light blue
      "hover:from-[#11998e] hover:to-[#38ef7d] hover:text-[#145a32]", // teal to green
      "hover:from-[#fc5c7d] hover:to-[#6a82fb] hover:text-[#b83b5e]", // pink to blue
      "hover:from-[#c471f5] hover:to-[#fa71cd] hover:text-[#6d44b8]", // purple to pink
      "hover:from-[#f7797d] hover:to-[#FBD786] hover:text-[#b3541a]", // coral to yellow
    ];
    return `hover:bg-gradient-to-r ${
      hoverGradients[index % hoverGradients.length]
    } hover:outline hover:outline-2 dark:hover:outline-[#b8c0ff] hover:outline-[#9d4edd]`;
  };

  return (
    <>
      {dataPost && (
        <HorizontalScrollingFeaturedArticles slug={dataPost?.slug} />
      )}
      {/* <Header logo={<Logo />}>
        <HeaderContent />
      </Header> */}
      <Header />

      <Conatainer>
        {dataPost && (
          <div className="grid grid-cols-12 gap-6">
            <div className="hidden sm:block col-span-1">
              <div className="sticky top-20">
                <SidebarMenu post={dataPost} />
              </div>
            </div>
            <div className="col-span-12 sm:col-span-8">
              {dataPost.thumbnail && (
                <div className="shadow-lg dark:shadow-[#2e205b]">
                  <img
                    src={dataPost.thumbnail}
                    alt={dataPost.title}
                    className="w-full h-60 rounded-t-lg object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div
                className={clsx(
                  "rounded-b-lg px-1 sm:px-6 py-6 mb-6",
                  "dark:bg-[#0d032d] bg-[#ffffff] shadow-lg dark:shadow-[#2e205b]"
                )}
              >
                <div className="flex flex-col lg:flex-row lg:justify-between">
                  <Categories category={dataPost.category} />

                  <p
                    className={clsx(
                      "mb-4 text-sm italic",
                      "dark:text-violet-300 text-slate-500"
                    )}
                  >
                    {formatToLocalDateTimePost(dataPost.createdAt)}
                  </p>
                </div>
                {/* -------------- Thông tin tác giả -------------- */}
                {dataPost?.author && (
                  <div className="flex items-center mb-4 ">
                    <Image
                      src={dataPost?.author?.avatar}
                      alt={dataPost?.author?.fullname}
                      className={clsx(
                        "w-auto h-6 rounded-full mr-2 cursor-pointer hover:scale-110 transition-transform duration-300",
                        "border-2 border-violet-300 hover:border-violet-400"
                      )}
                      width={40}
                      height={40}
                    />
                    <span
                      className={clsx(
                        "font-semibold text-sm relative group  cursor-pointer",
                        "dark:text-slate-400 dark:hover:text-violet-300 text-slate-600 hover:text-violet-500"
                      )}
                    >
                      {dataPost?.author?.fullname}
                      <div
                        className={clsx(
                          "absolute left-0 top-full mt-2 hidden text-sm rounded-lg shadow-lg p-4 z-10",
                          "group-hover:block",
                          "dark:bg-indigo-950 dark:text-white",
                          "bg-white text-zinc-700"
                        )}
                      >
                        <p className="font-bold  mb-2">
                          {dataPost?.author?.fullname}
                        </p>
                        <Image
                          src={dataPost?.author?.avatar}
                          alt={dataPost?.author?.fullname}
                          className="w-auto h-16 rounded-full mb-2"
                          width={40}
                          height={40}
                        />
                        <p>{dataPost?.author?.email || "Anonymous"}</p>
                      </div>
                    </span>
                  </div>
                )}
                {/* ---------------------------- */}
                <hr className="border-violet-400 mb-4" />
                <h1
                  className={clsx(
                    "text-3xl font-bold mb-4 ",
                    "dark:text-white text-slate-900"
                  )}
                >
                  {dataPost.title}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {dataPost?.keywords.length > 0 &&
                    dataPost.keywords.map((keyword, idx) => (
                      <Link
                        key={idx}
                        href={`/tim-kiem?keyword=${encodeURIComponent(
                          keyword
                        )}`}
                        className={clsx(
                          "text-base px-2 py-1 rounded flex items-center group",
                          getRandomHoverGradient(idx),
                          "hover:opacity-80 transition duration-200",
                          "dark:hover:opacity-90",
                          "dark:text-white text-[#6353de]"
                        )}
                      >
                        <span
                          className={clsx(
                            "font-bold text-[#9d4edd] dark:text-[#c77dff] transition-colors duration-200",
                            "group-hover:backdrop-blur-lg group-hover:text-zinc-700 dark:group-hover:text-[#e0b8fe]"
                          )}
                        >
                          #
                        </span>
                        <span
                        // className={clsx(
                        //   "group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-colors duration-200"
                        // )}
                        >
                          {keyword}
                        </span>
                      </Link>
                    ))}
                </div>
                <p
                  className={clsx(
                    "mb-4 mt-2",
                    "dark:text-gray-300 text-slate-600"
                  )}
                >
                  {dataPost.description}
                </p>
                <IncreaseView slug={dataPost.slug} />
                <TableOfContentsSlug
                  items={dataPost?.toc || []}
                  className="w-full sm:w-9/12 md:w-2/5"
                  collapsible={true}
                  showIcon={true}
                />
                <div className="prose prose-invert prose-violet max-w-none">
                  <ParseHTML html={dataPost.content} />
                </div>
                <div className="mt-6">
                  <LayoutPostComments postId={dataPost._id} />
                </div>
              </div>
              <div className="mb-10"></div>
              <SameCategories categories={dataPost.category || []} />
              <div className="mb-10"></div>
              <LatestNews slug={dataPost.slug} />
              <div className="mb-10"></div>
            </div>
            <div className="hidden sm:block col-span-3">
              <Sidebar>
                <NewsSlider slug={[randomContentData[0]?.value || ""]} />

                <div className="bg-slate-200 dark:bg-slate-900 bg-opacity-40 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <FeaturedTab />
                </div>

                <div className="bg-slate-200 dark:bg-slate-900 bg-opacity-40 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <div className="space-y-4">
                    <Card slug={[randomContentData[1]?.value || ""]} />
                    <Card slug={[randomContentData[2]?.value || ""]} />
                    <Card slug={[randomContentData[3]?.value || ""]} />
                    <Card slug={[randomContentData[4]?.value || ""]} />
                  </div>
                </div>
              </Sidebar>
            </div>
          </div>
        )}

        {!dataPost && (
          <div className="flex flex-col items-center justify-center h-screen bg-slate-900 bg-opacity-60 backdrop-blur-sm rounded-lg">
            <h1 className="text-2xl font-bold text-violet-300 mb-4">
              Xin lỗi, chúng tôi không tìm thấy bài viết này.
            </h1>
            <p className="text-gray-300">
              Có thể bài viết đã bị xóa hoặc không còn tồn tại trên trang web
              của chúng tôi.
            </p>
          </div>
        )}
        <div className="mt-8" />
        <NewsletterSubscription />
      </Conatainer>
      <Footer />
      <AutoScrollToTop />
      <ScrollToTopButton />
    </>
  );
}
