"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import clsx from "clsx";
import { Timeline } from "antd";

import type { AxiosResponse } from "@/lib/axiosInstance";
import type { GetAllPostRecentPublic } from "@/service/api/post/types";

import { listEmojiReactions } from "@/service/api/post/types";
import { queryKeys } from "@/constants/Common";
import { getAllPostRecentPublished } from "@/service/api/post";
import LazyLoadImage from "@components/LazyLoadImage";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { formatTimePost } from "@/shared/utils/time";
import { URL } from "@/constants/Common";

type LatestPostsProps = {};

const LatestPosts = (props: LatestPostsProps) => {
  const LIMIT = 5;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKeys.GET_LATEST_POSTS_PUBLIC],
      queryFn: ({ pageParam = 1 }: { pageParam?: unknown }) =>
        getAllPostRecentPublished(Number(pageParam), LIMIT),
      getNextPageParam: (response: AxiosResponse<GetAllPostRecentPublic>) => {
        if (response?.data?.currentPage < response?.data?.totalPages) {
          return response?.data?.currentPage + 1;
        }
        return undefined;
      },
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false, //fetch dữ liệu khi mount component
      refetchInterval: false, //thời gian tự động fetch lại dữ liệu
      retry: 1,
      retryDelay: 2000,
      retryOnMount: true, // retry when mount component
      gcTime: 1000 * 60 * 10, //thời gian xoá cache khi không sử dụng
      initialPageParam: 1,
    });

  const { targetRef } = useInfiniteScroll({
    onIntersection: async () => {
      if (!isFetchingNextPage && hasNextPage) {
        fetchNextPage().finally(() => {});
      }
    },
    enabled: !isFetchingNextPage && hasNextPage,
    threshold: 0.1,
    rootMargin: "300px", // khoảng cách giữa root và target
    debounceMs: 0, // thời gian debounce 0ms
  });

  const posts = useMemo(() => {
    return (
      data?.pages.flatMap((page) => {
        return page?.data?.data
          ? page?.data?.data.filter((post) => post?.rank === 0)
          : [];
      }) || []
    );
  }, [data]);

  //console.log("posts", posts);

  //không có bài viết nào
  if (posts.length === 0 && status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg
          className="w-16 h-16 text-[#9d4edd] mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20.25c4.556 0 8.25-3.694 8.25-8.25S16.556 3.75 12 3.75 3.75 7.444 3.75 12s3.694 8.25 8.25 8.25z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 10.75a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zm4.5 3.5a2.25 2.25 0 01-4.5 0"
          />
        </svg>
        <p className="text-lg font-semibold text-[#6353de] dark:text-[#b8c0ff] mb-2">
          Không có bài viết nào gần đây
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Hãy quay lại sau để xem những bài viết mới nhất nhé!
        </p>
      </div>
    );
  }
  //
  if (status === "pending") {
    return (
      <>
        {Array.from({ length: LIMIT }).map((_, idx) => {
          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-center w-full mb-4"
            >
              <div className="w-full bg-white dark:bg-[#3825657d] p-6 rounded-lg shadow-lg dark:shadow-none backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-full bg-[#e0e0ff] dark:bg-[#6353de]/30 animate-pulse" />
                  <div className="flex flex-col gap-1">
                    <span className="w-24 h-4 rounded bg-[#e0e0ff] dark:bg-[#6353de]/30 animate-pulse" />
                    <span className="w-16 h-3 rounded bg-[#e0e0ff] dark:bg-[#6353de]/30 animate-pulse" />
                  </div>
                </div>
                <div className="flex flex-col gap-4 border-b border-[#3c096c]/30 pb-6">
                  {/* Image */}
                  <div className="flex-shrink-0 w-full overflow-hidden rounded-t-lg">
                    <div className="overflow-hidden rounded-t-lg shadow-lg shadow-[#3c096c]/50">
                      <span className="block h-40 w-full bg-[#e0e0ff] dark:bg-[#6353de]/30 animate-pulse rounded-t-lg" />
                    </div>
                  </div>
                  {/* Text Content */}
                  <div className="sm:w-3/4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-3 flex items-center gap-2">
                        <span className="w-1/2 h-7 bg-[#e0e0ff] dark:bg-[#6353de]/30 rounded animate-pulse"></span>
                      </h3>
                      <div className="mt-4" />
                      <p className="text-sm line-clamp-4 flex flex-col gap-2">
                        <span className="block w-full h-4 bg-[#e0e0ff] dark:bg-[#6353de]/30 rounded animate-pulse"></span>
                        <span className="block w-5/6 h-4 bg-[#e0e0ff] dark:bg-[#6353de]/30 rounded animate-pulse"></span>
                        <span className="block w-4/6 h-4 bg-[#e0e0ff] dark:bg-[#6353de]/30 rounded animate-pulse"></span>
                        <span className="block w-3/6 h-4 bg-[#e0e0ff] dark:bg-[#6353de]/30 rounded animate-pulse"></span>
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="w-16 h-5 rounded bg-[#e0e0ff] dark:bg-[#6353de]/30 animate-pulse" />
                        <span className="w-12 h-5 rounded bg-[#e0e0ff] dark:bg-[#6353de]/30 animate-pulse" />
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <span className="w-6 h-4 rounded bg-[#e0e0ff] dark:bg-[#6353de]/30 animate-pulse" />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-10 h-4 rounded bg-[#e0e0ff] dark:bg-[#6353de]/30 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <p className="text-lg font-semibold text-[#6353de] dark:text-[#b8c0ff] mt-6">
          Đang tải...
        </p> */}
            </div>
          );
        })}
      </>
    );
  }

  const getRandomGradient = (index: number) => {
    const gradients = [
      "from-[#ff6f61] to-[#ffb88c]",
      "from-[#43cea2] to-[#185a9d]",
      "from-[#ffaf7b] to-[#d76d77]",
      "from-[#36d1c4] to-[#1e3c72]",
      "from-[#f7971e] to-[#ffd200]",
      "from-[#f953c6] to-[#b91d73]",
      "from-[#00c6ff] to-[#0072ff]",
      "from-[#f857a6] to-[#ff5858]",
      "from-[#4e54c8] to-[#8f94fb]",
      "from-[#11998e] to-[#38ef7d]",
      "from-[#fc5c7d] to-[#6a82fb]",
      "from-[#c471f5] to-[#fa71cd]",
      "from-[#f7797d] to-[#FBD786]",
      "from-[#43e97b] to-[#38f9d7]",
    ];
    return `bg-gradient-to-r ${gradients[index % gradients.length]}`;
  };

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
      {posts.length > 0 && (
        <>
          <div className="space-y-6 mb-4 bg-white dark:bg-[#3825657d] p-6 rounded-lg shadow-lg dark:shadow-none backdrop-blur-sm">
            <Timeline
              items={[
                ...posts.map((data, index) => {
                  //index cuối cùng
                  const isLastItem = index === posts.length - 1;
                  const linkUrl = `${URL}/${data.slug}`;
                  return {
                    color: "#9d4edd",
                    children: (
                      <>
                        <div key={index}>
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={data.author?.avatar}
                              alt={data.author?.fullname || "Tác giả"}
                              className="w-8 h-8 rounded-full object-cover border border-[#9d4edd]/40"
                            />
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-[#6353de] dark:text-[#b8c0ff]">
                                {data.author?.fullname || "(Không rõ tác giả)"}
                              </span>
                              <p className="text-sm italic text-[#7e79a0] dark:text-[#a9abbe] mb-1</p>">
                                {formatTimePost(data.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div
                            key={index}
                            className="flex flex-col gap-4 border-b border-[#3c096c]/30 pb-6"
                          >
                            {/* Image */}
                            <div className="flex-shrink-0 w-full overflow-hidden rounded-t-lg">
                              <Link title={data.description} href={linkUrl}>
                                <div className="overflow-hidden rounded-t-lg shadow-lg shadow-[#3c096c]/50">
                                  <LazyLoadImage
                                    height={"h-40"}
                                    width={"w-full"}
                                    options={{
                                      src: data.thumbnail,
                                      alt: data.description,
                                      width: 150,
                                      height: 100,
                                      className:
                                        "h-40 w-full object-cover hover:opacity-70 transition duration-300 transform hover:scale-105 rounded-t-lg",
                                      loading: "lazy",
                                    }}
                                  />
                                </div>
                              </Link>
                            </div>

                            {/* Text Content */}
                            <div className="sm:w-3/4 flex flex-col justify-between">
                              <div>
                                <Link title={data.title} href={linkUrl}>
                                  <h3
                                    className={clsx(
                                      "text-xl font-semibold mb-2 line-clamp-3 transition duration-200",
                                      "text-blue-700 hover:text-[#9d4edd] dark:text-[#e0e0ff] dark:hover:text-[#9d4edd]"
                                    )}
                                  >
                                    {data.title}
                                  </h3>
                                </Link>
                                <p
                                  className={clsx(
                                    "text-sm line-clamp-4",
                                    "dark:text-[#b8c0ff]/90 text-[#4477c9]",
                                    "hover:text-[#9d4edd] dark:hover:text-[#c77dff]"
                                  )}
                                >
                                  {data.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-2">
                                  {data?.keywords.length > 0 &&
                                    data.keywords.map((keyword, idx) => (
                                      <Link
                                        key={idx}
                                        href={`/tim-kiem?keyword=${encodeURIComponent(
                                          keyword
                                        )}`}
                                        className={clsx(
                                          "text-xs px-2 py-1 rounded flex items-center group",
                                          getRandomHoverGradient(index),
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
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {data?.category?.[0] && (
                                    <Link
                                      href={`/chu-de/${data?.category[0]?.slug}`}
                                      className={clsx(
                                        "text-xs text-white px-2 py-1 rounded",
                                        getRandomGradient(index),
                                        "hover:opacity-80 hover:text-slate-50 transition duration-200",
                                        "dark:text-white dark:hover:opacity-90"
                                      )}
                                    >
                                      {data?.category?.[0]?.name}
                                    </Link>
                                  )}
                                  {data?.category?.[0]?.child?.[0] && (
                                    <Link
                                      href={`/chu-de/${data?.category[0]?.slug}/${data?.category[0]?.child[0]?.slug}`}
                                      className={clsx(
                                        "text-xs text-white px-2 py-1 rounded",
                                        getRandomGradient(index),
                                        "hover:opacity-80 hover:text-slate-50 transition duration-200",
                                        "dark:text-white dark:hover:opacity-90"
                                      )}
                                    >
                                      {data?.category?.[0]?.child[0]?.name}
                                    </Link>
                                  )}
                                </div>
                                {/* Reaction & Comments */}
                                <div className="flex items-center gap-4 mt-3">
                                  <div className="flex items-center gap-1">
                                    {data.reactions
                                      .filter(
                                        (reaction) =>
                                          reaction.listUserId.length > 0
                                      )
                                      .sort((a, b) => {
                                        // Ưu tiên updatedAt mới nhất
                                        const aTime = new Date(
                                          a.updatedAt
                                        ).getTime();
                                        const bTime = new Date(
                                          b.updatedAt
                                        ).getTime();
                                        return bTime - aTime;
                                      })
                                      .map((reaction, idx) => {
                                        const emojiReaction =
                                          listEmojiReactions.find(
                                            (emoji) =>
                                              emoji.id === reaction.type
                                          );
                                        if (!emojiReaction) return null;
                                        return (
                                          <div
                                            key={idx}
                                            className="flex items-center gap-1"
                                          >
                                            <span
                                              role="img"
                                              aria-label={emojiReaction.emoji}
                                              className="text-lg"
                                            >
                                              {emojiReaction.emoji}
                                            </span>
                                            <span className="text-xs text-[#7e79a0] dark:text-[#b8c0ff] font-medium">
                                              {reaction.listUserId.length}
                                            </span>
                                          </div>
                                        );
                                      })}
                                  </div>
                                  {/* Comments */}
                                  <div className="flex items-center gap-1">
                                    <svg
                                      className="w-4 h-4 text-[#6353de] dark:text-[#b8c0ff]"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m12-8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h2"
                                      />
                                    </svg>
                                    <span className="text-xs text-[#7e79a0] dark:text-[#b8c0ff] font-medium">
                                      {data.totalComments} bình luận
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isLastItem && !isFetchingNextPage && hasNextPage && (
                          <div ref={targetRef} className="h-10" />
                        )}
                      </>
                    ),
                  };
                }),
                ...(hasNextPage && isFetchingNextPage
                  ? Array.from({ length: LIMIT }).map((_, idx) => ({
                      color: "#9d4edd",
                      children: (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-[#6353de] dark:text-[#b8c0ff]">
                              Đang tải...
                            </span>
                            <span className="inline-block w-4 h-4 border-2 border-[#9d4edd] border-t-transparent rounded-full animate-spin"></span>
                          </div>
                          <div
                            key={idx}
                            className="flex flex-col gap-4 border-b border-[#3c096c]/30 pb-6"
                          >
                            {/* Image */}
                            <div className="flex-shrink-0 w-full overflow-hidden rounded-t-lg">
                              <div className="overflow-hidden shadow-lg shadow-[#3c096c]/50 relative">
                                <LazyLoadImage
                                  height={"h-40"}
                                  width={"w-full"}
                                  options={{
                                    src: "/image/thumbnail_default.jpg",
                                    alt: "Đang tải...",
                                    width: 150,
                                    height: 100,
                                    className:
                                      "h-40 w-full object-cover hover:opacity-70 transition duration-300 transform hover:scale-105",
                                    loading: "lazy",
                                  }}
                                  isLoading={true}
                                />
                              </div>
                            </div>

                            {/* Text Content */}
                            <div className="w-full flex flex-col justify-between">
                              <div>
                                <h3
                                  className={clsx(
                                    "text-xl font-semibold mb-2 line-clamp-3 transition duration-200",
                                    "text-blue-700 hover:text-[#9d4edd] dark:text-[#e0e0ff] dark:hover:text-[#9d4edd]",
                                    "flex items-center gap-2"
                                  )}
                                >
                                  <span className="w-1/2 h-7 bg-[#e0e0ff] dark:bg-[#6353de]/30 rounded animate-pulse"></span>
                                </h3>

                                <div className="mt-4" />
                                <p
                                  className={clsx(
                                    "text-sm line-clamp-4",
                                    "dark:text-[#b8c0ff]/90 text-[#6353de]",
                                    "flex flex-col gap-2"
                                  )}
                                >
                                  <span className="block w-full h-4 bg-[#e0e0ff] dark:bg-[#6353de]/30 rounded animate-pulse"></span>
                                  <span className="block w-5/6 h-4 bg-[#e0e0ff] dark:bg-[#6353de]/30 rounded animate-pulse"></span>
                                  <span className="block w-4/6 h-4 bg-[#e0e0ff] dark:bg-[#6353de]/30 rounded animate-pulse"></span>
                                  <span className="block w-3/6 h-4 bg-[#e0e0ff] dark:bg-[#6353de]/30 rounded animate-pulse"></span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      ),
                    }))
                  : []),
              ]}
            />
          </div>
          {/* {!isFetchingNextPage && hasNextPage && (
            <div ref={targetRef} className="h-10 bg-red-300" />
          )} */}

          {!hasNextPage && posts.length > 0 && (
            <>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                Bạn đã xem hết tất cả bài viết.
              </div>
            </>
          )}
        </>
      )}

      {/* {!isFetchingNextPage && hasNextPage && (
        <button
          onClick={() => {
            fetchNextPage();
          }}
          className={clsx(
            "text-white dark:text-white",
            "hover:text-violet-100 dark:hover:text-violet-300",
            "transition",
            "duration-300",
            "ease-in-out",
            "block py-3",
            "bg-violet-600 hover:bg-violet-700 dark:bg-violet-900 dark:hover:bg-violet-800",
            "border border-solid border-violet-500 dark:border-violet-700",
            "rounded-md",
            "w-full"
          )}
        >
          Xem thêm
        </button>
      )} */}
    </>
  );
};

export default LatestPosts;
