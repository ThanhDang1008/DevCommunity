// import { Button, Result } from "antd";
import Link from "next/link";

import Header from "@components/layout/header";
import Footer from "@/components/layout/footer";
import Container from "@/components/layout/home/container";

import LatestNews from "@modules/post/LatestNews";

const NotFoundPage = () => {
  return (
    <>
      <Header />

      {/* Main Content */}
      {/* <div
        style={{
          background:
            "radial-gradient(circle, rgba(22, 7, 60, 1) 11%, rgba(1, 9, 23, 1) 89%)",
        }}
      >
  
      </div> */}

      {/* Latest News Section */}
      <Container>
        <div className="min-h-screen flex-grow flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Left Side - Image */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative max-w-md">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 opacity-75 blur"></div>
                  <div className="relative bg-gray-900 p-1 rounded-lg">
                    {/* <Image
                    src="/404-space.svg"
                    alt="404 Illustration"
                    width={500}
                    height={400}
                    className="rounded-lg"
                    // Fallback if no image is available
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  /> */}
                    <div className="hidden w-full h-64 bg-gray-800 rounded-lg items-center justify-center">
                      <p className="text-gray-400 text-center">
                        404 Illustration
                      </p>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-6 -left-6 w-12 h-12 bg-purple-500 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute -bottom-4 right-12 w-8 h-8 bg-cyan-400 rounded-full opacity-60 animate-pulse delay-300"></div>
                  <div className="absolute top-1/3 -right-4 w-6 h-6 bg-pink-400 rounded-full opacity-60 animate-pulse delay-700"></div>
                </div>
              </div>

              {/* Right Side - Text Content */}
              <div className="w-full lg:w-1/2 text-center lg:text-left mt-6 lg:mt-0">
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300 leading-tight">
                  404
                </h1>
                <h2 className="text-2xl md:text-3xl text-white font-medium mt-4">
                  Trang không tồn tại
                </h2>
                <p className="text-gray-300 mt-4 max-w-md mx-auto lg:mx-0">
                  Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
                  Có thể nó đã bị di chuyển hoặc không còn tồn tại.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Quay về trang chủ
                  </Link>
                  <Link
                    href="/lien-he"
                    className="px-6 py-3 bg-transparent border-2 border-purple-500 text-purple-300 hover:text-white hover:border-purple-400 font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Liên hệ hỗ trợ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LatestNews slug={""} />
        <div className="pb-10" />
      </Container>
      <Footer />
    </>
  );
};

export default NotFoundPage;
