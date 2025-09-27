import Image from "next/image";
import Link from "next/link";
import Header from "@components/layout/header";
import Footer from "@/components/layout/footer";

import Conatainer from "@/components/layout/home/container";
import LatestNews from "@modules/post/LatestNews";
import clsx from "clsx";

const NotFoundPage = () => {
  return (
    <>
      <Header />
      <div
        className={clsx(
          "min-h-screen flex flex-col md:flex-row",
          "custom-bg-light-container dark:custom-bg-dark-container" // chế độ sáng
        )}
      >
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/image/not-found-post.jpg"
              alt="Not Found"
              width={400}
              height={400}
              className="max-w-full h-auto"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1
              className={clsx(
                "text-6xl md:text-9xl font-extrabold text-transparent bg-clip-text",
                "bg-gradient-to-r from-purple-600 to-cyan-500",
                "dark:from-purple-400 dark:to-cyan-300"
              )}
            >
              404
            </h1>
            <p
              className={clsx(
                "text-lg md:text-2xl mt-2",
                "text-gray-700 dark:text-gray-200"
              )}
            >
              Xin lỗi, chúng tôi không tìm thấy bài viết này.
            </p>
            <Link
              href="/"
              className={clsx(
                "mt-6 inline-block py-3 px-6 rounded-lg shadow-lg transition-all duration-300",
                "bg-gradient-to-r text-white",
                "from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600",
                "dark:from-purple-600 dark:to-cyan-500 dark:hover:from-purple-700 dark:hover:to-cyan-600"
              )}
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-gray-900">
        <Conatainer>
          <div className="pt-8">
            <LatestNews slug={""} />
          </div>
          <div className="pb-10" />
        </Conatainer>
      </div>
      <Footer />
    </>
  );
};

export default NotFoundPage;
