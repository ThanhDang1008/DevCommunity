import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { getAllPostByViewPublicNext } from "@/service/api/post";
import clsx from "clsx";
import { URL } from "@/constants/Common";
import { timeSince } from "@/shared/utils/time";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

import LazyLoadImage from "@/components/LazyLoadImage";

const getAllPostByViewPublished = cache(getAllPostByViewPublicNext);

const MostViewedArticles = async () => {
  let dataPost = null;

  try {
    const response = await getAllPostByViewPublished(1, 5);
    if (response.status === 200) {
      dataPost = response.data.data;
    }
  } catch (error) {}

  return (
    <>
      {dataPost && dataPost.length > 0 && (
        <section className="mx-auto relative">
          {/* Title with gradient */}
          {/* <div className="mb-8">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 inline-block">
              Featured Articles
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mt-2 rounded-full"></div>
          </div> */}

          {/* Vertical List of Articles */}
          <div className="space-y-6">
            {dataPost.map((data, index) => (
              <div
                key={index}
                className={clsx(
                  "flex flex-col gap-4 pb-6 relative",
                  "group",
                  // "sm:flex-row-reverse",
                  "bg-gray-100/50 dark:bg-gray-900/30 hover:bg-gray-200/60 dark:hover:bg-gray-800/40 rounded-xl p-4",
                  "border border-gray-300/50 dark:border-gray-800/50 hover:border-purple-500/60 dark:hover:border-purple-500/50 transition-all duration-300",
                  "hover:shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10"
                )}
              >
                {/* Image */}
                <div
                  className={clsx(
                    "flex-shrink-0 w-full overflow-hidden rounded-lg"
                  )}
                >
                  <Link title={data.description} href={`${URL}/${data.slug}`}>
                    <div className="relative overflow-hidden rounded-lg">
                      <LazyLoadImage
                        height={"h-44 sm:h-32"}
                        width={"w-full"}
                        options={{
                          src: data.thumbnail,
                          alt: data.description,
                          width: 150,
                          height: 100,
                          className:
                            "h-44 sm:h-32 w-full object-cover transition duration-500 group-hover:scale-110 rounded-lg",
                          loading: "lazy",
                        }}
                      />
                    </div>
                  </Link>
                </div>

                {/* Text Content */}
                <div className={clsx("w-full flex flex-col justify-between")}>
                  <div>
                    <Link title={data.title} href={`${URL}/${data.slug}`}>
                      <h3
                        className={clsx(
                          "text-base font-semibold text-blue-700 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 mb-2 line-clamp-2 transition duration-200"
                        )}
                      >
                        {data.title}
                      </h3>
                    </Link>

                    <p
                      className={clsx(
                        "text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3"
                      )}
                    >
                      {data.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <ChartNoAxesColumnIncreasing className="w-4 h-4 mr-1" />
                        <span>{data?.view || 0} 🔥</span>
                      </div>
                    </div>

                    {/* Meta information */}
                    {/* <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <span>Posted {timeSince(new Date(data.createdAt))}</span>
                      </div>
                    </div> */}
                  </div>

                  {/* Read more link */}
                  <div className="mt-3 text-right">
                    <Link
                      href={`${URL}/${data.slug}`}
                      className="inline-flex items-center text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
                    >
                      Xem ngay
                      <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View all link */}
          {/* <div className="mt-6 text-right">
            <Link 
              href="/articles"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600/50 hover:bg-purple-600/70 rounded-full transition-colors duration-300"
            >
              View all articles
              <span className="ml-1">→</span>
            </Link>
          </div>
           */}
        </section>
      )}
    </>
  );
};

export default MostViewedArticles;
