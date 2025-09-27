import Link from "next/link";
import clsx from "clsx";
import { Timeline } from "antd";
import { Pin } from "lucide-react";

import LazyLoadImage from "@components/LazyLoadImage";
import { formatTimePost } from "@/shared/utils/time";
import { URL } from "@/constants/Common";
import { getAllPostByRankNext } from "@/service/api/post";

type TypePinnedPostProps = {};

const PinnedPosts = async (props: TypePinnedPostProps) => {
  let dataPost = null;
  try {
    const response = await getAllPostByRankNext(1, 13, false);
    if (response.status === 200) {
      dataPost = response.data.data;
    }
  } catch (error) {}

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
  //console.log("PinnedPosts dataPost", dataPost);

  return (
    <>
      {dataPost && dataPost.length > 0 && (
        <>
          <div className="space-y-6 mb-4 bg-white dark:bg-gray-900/50 p-6 rounded-lg shadow-lg dark:shadow-none backdrop-blur-sm">
            <Timeline
              items={[
                ...dataPost.map((data, index) => {
                  const isLastItem = index === dataPost.length - 1;
                  const linkUrl = `${URL}/${data.slug}`;
                  return {
                    color: "#d0d600",
                    children: (
                      <>
                        <div key={index}>
                          <div className="flex items-center gap-2 mb-2 justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={data.author?.avatar}
                                alt={data.author?.fullname || "Tác giả"}
                                className="w-8 h-8 rounded-full object-cover border border-[#9d4edd]/40"
                              />
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-[#6353de] dark:text-[#b8c0ff]">
                                  {data.author?.fullname ||
                                    "(Không rõ tác giả)"}
                                </span>
                                <p className="text-sm italic text-[#7e79a0] dark:text-[#a9abbe] mb-1">
                                  {formatTimePost(data.createdAt)}
                                </p>
                              </div>
                            </div>
                            <span
                              title="Bài viết được ghim"
                              className="ml-2 text-[#d0d600]"
                            >
                              <Pin className="w-5 h-5" fill="currentColor" />
                            </span>
                          </div>
                          <div
                            key={index}
                            className={clsx(
                              "flex flex-col gap-4 pb-6",
                              !isLastItem && "border-b border-[#3c096c]/30"
                            )}
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
                                  {data?.keywords?.length > 0 &&
                                    data?.keywords.map((keyword, idx) => (
                                      <Link
                                        key={idx}
                                        href={`/tim-kiem?keyword=${encodeURIComponent(
                                          keyword
                                        )}`}
                                        className={clsx(
                                          "text-xs px-2 py-1 rounded flex items-center group",
                                          getRandomHoverGradient(index),
                                          "transition duration-200",
                                          "dark:hover:opacity-90 hover:opacity-80",
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
                                      {data?.category[0]?.name}
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
                                    <span
                                      role="img"
                                      aria-label="like"
                                      className="text-[#ff6f61] text-lg"
                                    >
                                      👍
                                    </span>
                                    <span className="text-xs text-[#7e79a0] dark:text-[#b8c0ff] font-medium">
                                      {((index * 17) % 100) + 1}
                                    </span>
                                    <span
                                      role="img"
                                      aria-label="love"
                                      className="ml-2 text-[#fa71cd] text-lg"
                                    >
                                      ❤️
                                    </span>
                                    <span className="text-xs text-[#7e79a0] dark:text-[#b8c0ff] font-medium">
                                      {((index * 13) % 50) + 1}
                                    </span>
                                    <span
                                      role="img"
                                      aria-label="wow"
                                      className="ml-2 text-[#f7797d] text-lg"
                                    >
                                      😮
                                    </span>
                                    <span className="text-xs text-[#7e79a0] dark:text-[#b8c0ff] font-medium">
                                      {((index * 7) % 20) + 1}
                                    </span>
                                  </div>
                                  {/* Comments (random sample based on index) */}
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
                                      {((index * 11) % 30) + 1} bình luận
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ),
                  };
                }),
              ]}
            />
          </div>
        </>
      )}
    </>
  );
};

export default PinnedPosts;
