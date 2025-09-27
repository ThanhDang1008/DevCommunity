// import Image from "next/image";
// import Link from "next/link";
// import Header from "@components/header";
// import HeaderContent from "@components/header/header-content";
// import Logo from "@components/header/logo";
// import Footer from "@/components/layout/footer";

// import Conatainer from "@/components/layout/home/container";
// import LatestNews from "@modules/post/LatestNews";

// const NotFoundPage = () => {
//   return (
//     <>
//       <Header logo={<Logo />}>
//         <HeaderContent />
//       </Header>
//       <div
//         className="min-h-screen flex flex-col md:flex-row"
//         style={{ background: "radial-gradient(circle, rgba(22, 7, 60, 1) 11%, rgba(1, 9, 23, 1) 89%)" }}
//       >
//         <div className="flex-1 flex items-center justify-center p-4">
//           <div className="relative overflow-hidden rounded-lg shadow-xl">
//             <Image
//               src="/image/not-found-post.jpg"
//               alt="Not Found"
//               width={400}
//               height={400}
//               className="max-w-full h-auto"
//             />
//             <div className="absolute inset-0 bg-black bg-opacity-20"></div>
//           </div>
//         </div>
//         <div className="flex-1 flex items-center justify-center p-4">
//           <div className="text-center">
//             <h1 className="text-6xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
//               404
//             </h1>
//             <p className="text-lg md:text-2xl text-gray-200 mt-2">
//               Xin lỗi, chúng tôi không tìm thấy chủ đề này.
//             </p>
//             <Link
//               href="/"
//               className="mt-6 inline-block bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
//             >
//               Quay về trang chủ
//             </Link>
//           </div>
//         </div>
//       </div>
//       <div className="bg-gray-900">
//         <Conatainer>
//           <div className="pt-8">
//             <LatestNews slug={""} />
//           </div>
//           <div className="pb-10" />
//         </Conatainer>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default NotFoundPage;
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx"; // thêm clsx
import Header from "@components/layout/header";
import Footer from "@/components/layout/footer";
import Conatainer from "@/components/layout/home/container";
import LatestNews from "@modules/post/LatestNews";

const NotFoundPage = () => {
  return (
    <>
      <Header />

      <div
        className={clsx(
          "min-h-screen flex flex-col md:flex-row",
          "custom-bg-light-container text-gray-900", // chế độ sáng
          "dark:text-white dark:custom-bg-dark-container" // chữ trắng khi tối
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
            <div className="absolute inset-0 bg-black bg-opacity-20 dark:bg-opacity-20 bg-opacity-10" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-6xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-purple-400 dark:to-cyan-300">
              404
            </h1>
            <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-200 mt-2">
              Xin lỗi, chúng tôi không tìm thấy chủ đề này.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
      <div className={clsx("bg-gray-100", "dark:bg-gray-900")}>
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
