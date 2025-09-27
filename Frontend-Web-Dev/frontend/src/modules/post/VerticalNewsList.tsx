import Link from "next/link";
import { cache } from "react";
import { getAllPostRecentPublishedNext } from "@/service/api/post";
import clsx from "clsx";
import { URL } from "@/constants/Common";
import { timeSince } from "@/shared/utils/time";

import LazyLoadImage from "@/components/LazyLoadImage";

const getPostRecentPublished = cache(getAllPostRecentPublishedNext);

const VerticalNewsList = async () => {
  let dataPost = null;
  let totalPages = 1;

  try {
    const response = await getPostRecentPublished(1, 40);
    if (response.status === 200) {
      dataPost = response.data.data;
      totalPages = response.data.totalPages;
    }
  } catch (error) {}

  return (
    <>
      {dataPost && dataPost.length > 0 && (
        <section className="mx-auto p-4">
          <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 uppercase hover:text-purple-500 dark:hover:text-purple-300 transition duration-300 ease-in-out mb-4">
            <Link
              id={"bai-viet-moi-nhat"}
              title="Bài viết mới nhất"
              href={`${URL}/bai-viet-moi-nhat`}
            >
              Bài viết mới nhất
            </Link>
          </h2>

          <hr className="border-t border-purple-300 dark:border-purple-800 mb-4" />
          {/* Vertical List of Articles */}
          <div className="space-y-4">
            {dataPost.map((data, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 border-b border-purple-400 dark:border-purple-900 pb-4 hover:bg-purple-50 dark:hover:bg-purple-900 hover:bg-opacity-50 dark:hover:bg-opacity-20 rounded-lg p-2 transition duration-300"
              >
                {/* Image */}
                <div className="flex-shrink-0 sm:w-1/4 shadow-lg shadow-[#3c096c]/50 rounded-lg overflow-hidden">
                  <Link title={data.description} href={`${URL}/${data.slug}`}>
                    <LazyLoadImage
                      height={"h-44"}
                      width={"w-full"}
                      options={{
                        src: data.thumbnail,
                        alt: data.description,
                        width: 300,
                        height: 200,
                        className:
                          "h-44 w-full object-cover rounded-lg hover:opacity-80 transition duration-200",
                        loading: "lazy",
                      }}
                    />
                  </Link>
                </div>
                {/* Text Content */}
                <div className="sm:w-3/4 flex flex-col justify-between">
                  <div>
                    <Link title={data.title} href={`${URL}/${data.slug}`}>
                      <h3 className="text-lg font-semibold mb-1 line-clamp-3 text-blue-700 dark:text-gray-100 hover:text-violet-500 dark:hover:text-cyan-300 transition duration-200">
                        {data.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4">
                      {data.description}
                    </p>

                    <p className="text-violet-600 dark:text-cyan-400 text-xs mt-2">
                      {timeSince(data.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              title="Xem thêm bài viết mới"
              href={`${URL}/bai-viet-moi-nhat?p=${
                totalPages > 1 ? totalPages : 1
              }`}
              className={clsx(
                "text-white dark:text-white",
                "hover:text-violet-100 dark:hover:text-violet-300",
                "transition",
                "duration-300",
                "ease-in-out",
                "block py-3",
                "bg-violet-600 hover:bg-violet-700 dark:bg-violet-900 dark:hover:bg-violet-800",
                "border border-solid border-violet-500 dark:border-violet-700",
                "rounded-md"
              )}
            >
              Xem thêm bài viết mới
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

export default VerticalNewsList;
