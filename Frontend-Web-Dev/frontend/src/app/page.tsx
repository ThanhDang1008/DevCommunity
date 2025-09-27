import Link from "next/link";
import clsx from "clsx";

import Container from "@/components/layout/home/container";
import Sidebar from "@/components/layout/sidebar-post";
import NewsSlider from "@modules/post/news-slider";
import Footer from "@/components/layout/footer";
// import FeaturedTab from "@modules/home/content/sidebar-post/featured-tab";
// import ProjectTimeline from "@components/ProjectTimeline";

import { ListCategories } from "@modules/tag/ListCategories";
import MostViewedArticles from "@modules/post/MostViewedArticles";
import FeaturedArticles from "@modules/post/FeaturedArticles";
import CategoriesList from "@modules/post/CategoriesList";
import NewsGrid from "@modules/post/NewsGrid";
import VerticalNewsList from "@modules/post/VerticalNewsList";
import HorizontalScrollingBanner from "@components/HorizontalScrollingBanner";
import ScrollToTopButton from "@/components/ui/button/ScrollToTopButton";

import Card from "@modules/post/Card.Sidebar";

import CustomCursor from "@/components/cursor/CustomCursor";

import { randomContent } from "@/shared/utils/random-content";
import Introduce from "@/components/Introduce";
import Header from "@components/layout/header";
import NewsletterSubscription from "@components/NewsletterSubscription";
import LatestPosts from "@modules/post/LatestPosts";
import PinnedPosts from "@modules/post/PinnedPosts";

export default async function Page() {
  const randomContentData = await randomContent();

  return (
    <>
      <CustomCursor />
      <Header />
      <div
        className={clsx(
          "custom-bg-light-container dark:custom-bg-dark-container",
          "pt-7 px-2 md:px-10 lg:px-12 xl:px-14 2xl:px-16"
        )}
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-4 lg:col-span-2">
            <ListCategories />
            <div className="mt-6" />
            <MostViewedArticles />
            <div className="mt-6" />
            <HorizontalScrollingBanner />
          </div>
          <div className="col-span-12 sm:col-span-8 lg:col-span-7">
            <PinnedPosts />
            <hr className="border-t border-[#6247aa] mb-6" />
            <LatestPosts />
          </div>
          <div className="col-span-3 hidden lg:block">
            <Sidebar>
              {/* <FeaturedTab /> */}
              <NewsSlider slug={[randomContentData[0]?.value || ""]} />
              <Card slug={[randomContentData[1]?.value || ""]} />
              <Card slug={[randomContentData[2]?.value || ""]} />
              <Card slug={[randomContentData[3]?.value || ""]} />
              <Card slug={[randomContentData[4]?.value || ""]} />
              <Card slug={[randomContentData[5]?.value || ""]} />
              <Card slug={[randomContentData[6]?.value || ""]} />
            </Sidebar>
          </div>
        </div>
      </div>
      {/* <Container> */}
      {/* <Introduce /> */}
      {/* <ProjectTimeline /> */}
      {/* <div className="flex flex-col"> */}
      {/* <div className="flex flex-col md:flex-row justify-between mx-auto mt-8 mb-4 gap-7">
            <FeaturedArticles />
            <MostViewedArticles />
          </div>  col-span-10 sm:col-span-7 mx-auto h-screen overflow-y-auto*/}

      {/* <HorizontalScrollingBanner /> */}
      {/* <div className="mx-auto mt-8">
            <div className="grid grid-cols-10 gap-4">
              <div className="col-span-10 md:col-span-7">
                <div className="mb-8">
                  <CategoriesList slug={[randomContentData[0]?.value || ""]} />
                  <CategoriesList slug={[randomContentData[1]?.value || ""]} />
                  <NewsGrid slug={[randomContentData[2]?.value || ""]} />
                  <CategoriesList slug={[randomContentData[3]?.value || ""]} />
                  <CategoriesList slug={[randomContentData[4]?.value || ""]} />
                  <NewsGrid slug={[randomContentData[5]?.value || ""]} />
                </div>
               
              </div>
              <div className="col-span-3 hidden md:block">
                <Sidebar>
                  <NewsSlider slug={[randomContentData[6]?.value || ""]} />

                  <Card slug={[randomContentData[7]?.value || ""]} />
                  <Card slug={[randomContentData[8]?.value || ""]} />
                  <Card slug={[randomContentData[9]?.value || ""]} />
                </Sidebar>
              </div>
            </div>
          </div> */}
      {/* </div> */}
      {/* <div className="mt-8" />
        <NewsletterSubscription /> */}
      {/* </Container> */}

      <Footer />
      <ScrollToTopButton />
    </>
  );
}
