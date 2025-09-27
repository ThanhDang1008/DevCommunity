import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { getAllPostRecentPublishedNext } from "@/service/api/post";
import clsx from "clsx";
import { URL } from "@/constants/Common";

import LazyLoadImage from "@/components/LazyLoadImage";

const getPostRecentPublished = cache(getAllPostRecentPublishedNext);

type LatestNewsProps = {
  slug: string;
};

const LatestNews = async (props: LatestNewsProps) => {
  let dataPost = null;

  try {
    const response = await getPostRecentPublished(1, 10);
    if (response.status === 200) {
      dataPost = response.data.data;
      dataPost = dataPost.filter((item) => item.slug !== props.slug);
    }
  } catch (error) {}

  return (
    <>
      {dataPost && dataPost.length > 0 && (
        <section className="mx-auto rounded-lg bg-white bg-opacity-80 dark:bg-slate-900 dark:bg-opacity-40 p-6 backdrop-blur-sm shadow-lg dark:shadow-none">
          {/* Category Header */}
          <h2
            className={clsx(
              "text-2xl font-bold",
              "text-violet-600 hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200",
              "transition duration-300 ease-in-out mb-6",
              "border-b border-violet-300 dark:border-violet-700 pb-2",
              "inline-block"
            )}
          >
            Có thể bạn quan tâm
          </h2>
          {/* Vertical List of Articles */}
          <div className="space-y-6">
            {dataPost.map((data, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 border-b border-gray-200 dark:border-slate-700 pb-6 hover:bg-gray-50 dark:hover:bg-slate-800 hover:bg-opacity-80 dark:hover:bg-opacity-40 p-3 rounded-md transition duration-300"
              >
                {/* Image */}
                <div className="flex-shrink-0 sm:w-1/4 shadow-md rounded-md">
                  <Link
                    title={data.description}
                    href={`${URL}/${data.slug}`}
                    className="block overflow-hidden rounded-lg"
                  >
                    <LazyLoadImage
                      height={"h-48 sm:h-44"}
                      width={"w-full"}
                      options={{
                        src: data.thumbnail,
                        alt: data.description,
                        width: 150,
                        height: 100,
                        className:
                          "h-48 sm:h-44 w-full object-cover hover:opacity-90 transition duration-200 rounded-lg",
                        loading: "lazy",
                      }}
                    />
                  </Link>
                </div>
                {/* Text Content */}
                <div className="sm:w-3/4 flex flex-col justify-between">
                  <div>
                    <Link title={data.title} href={`${URL}/${data.slug}`}>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-3 text-blue-700 dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition duration-200">
                        {data.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4">
                      {data.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="mt-6 text-center">
            <Link
              href={`${URL}/bai-viet-moi-nhat`}
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
          </div> */}
        </section>
      )}
    </>
  );
};

export default LatestNews;
