// import Image from "next/image";
// import Link from "next/link";
// import { getAllPostByRankNext } from "@/service/api/post";
// import { cache } from "react";
// import clsx from "clsx";
// import { URL } from "@/constants/Common";

// import LazyLoadImage from "@/components/LazyLoadImage";

// const getPostByRank = cache(getAllPostByRankNext);

// const FeaturedArticles = async () => {
//   let dataPost = null;
//   try {
//     const response = await getPostByRank(1, 13);
//     if (response.status === 200) {
//       dataPost = response.data.data;
//     }
//   } catch (error) {}

//   return (
//     <>
//       {dataPost && dataPost.length > 0 && (
//         <section className="mx-auto p-6 rounded-xl border border-gray-800/50 backdrop-blur-sm bg-gray-900/30">
//           {/* Section Title */}
//           {/* <div className="mb-8">
//             <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 inline-block">
//               Featured Articles
//             </h2>
//             <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mt-2 rounded-full"></div>
//           </div> */}

//           {/* Featured Article */}
//           <div className="flex flex-col md:flex-row gap-6 mb-10 group">
//             {/* Image */}
//             <div className="md:w-1/2 overflow-hidden group-hover:border-purple-500/30 transition-colors duration-300">
//               <Link
//                 title={dataPost[0]?.description}
//                 href={`${URL}/${dataPost[0]?.slug}`}
//               >
//                 <div className="relative overflow-hidden rounded-xl">
//                   <LazyLoadImage
//                     height={"h-64"}
//                     width={"w-full"}
//                     options={{
//                       src: dataPost[0]?.thumbnail,
//                       alt: dataPost[0]?.description,
//                       width: 600,
//                       height: 400,
//                       className:
//                         "h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105",
//                       loading: "lazy",
//                     }}
//                   />
//                 </div>
//               </Link>
//             </div>

//             {/* Text Content */}
//             <div className="md:w-1/2 flex flex-col justify-between">
//               <div>
//                 <Link
//                   title={dataPost[0]?.title}
//                   href={`${URL}/${dataPost[0]?.slug}`}
//                 >
//                   <h3 className="text-2xl line-clamp-3 font-bold mb-3 text-white hover:text-purple-300 transition duration-300 ease-in-out">
//                     {dataPost[0]?.title}
//                   </h3>
//                 </Link>
//                 <p className="text-gray-400 mb-6 line-clamp-5">
//                   {dataPost[0]?.description}
//                 </p>
//                 <Link
//                   title="Xem tiếp"
//                   className={clsx(
//                     "px-4 py-2 rounded-full transition duration-300 ease-in-out",
//                     "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700",
//                     "sm:px-6 sm:py-3",
//                     "flex justify-center sm:inline-flex"
//                   )}
//                   href={`${URL}/${dataPost[0]?.slug}`}
//                 >
//                   Xem tiếp
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* Grid of Smaller Articles */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {dataPost.map((post, index) => {
//               if (index >= 1) {
//                 return (
//                   <div
//                     key={index}
//                     className="flex flex-col group bg-gray-900/20 rounded-lg p-3 border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 hover:bg-gray-800/30"
//                   >
//                     <div className="flex-shrink-0 overflow-hidden rounded-lg mb-3">
//                       <Link
//                         title={post.description}
//                         href={`${URL}/${post.slug}`}
//                       >
//                         <div className="overflow-hidden">
//                           <LazyLoadImage
//                             height={"h-44"}
//                             width={"w-full"}
//                             options={{
//                               src: post.thumbnail,
//                               alt: post.description,
//                               width: 300,
//                               height: 200,
//                               className:
//                                 "h-44 object-cover w-full mx-auto transition-transform duration-500 group-hover:scale-105",
//                               loading: "lazy",
//                             }}
//                           />
//                         </div>
//                       </Link>
//                     </div>
//                     {/* Title */}
//                     <div className="mt-2">
//                       <Link title={post.title} href={`${URL}/${post.slug}`}>
//                         <h3 className="text-sm font-semibold text-gray-200 hover:text-purple-300 transition duration-300 ease-in-out line-clamp-2">
//                           {post.title}
//                         </h3>
//                       </Link>
//                     </div>
//                   </div>
//                 );
//               }
//             })}
//           </div>

//           {/* View all link */}
//           {/* <div className="mt-8 text-center">
//             <Link 
//               href="/articles"
//               className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-purple-600/50 hover:bg-purple-600/70 rounded-full transition-colors duration-300"
//             >
//               Xem tất cả bài viết
//               <span className="ml-2">→</span>
//             </Link>
//           </div> */}
//         </section>
//       )}
//     </>
//   );
// };

// export default FeaturedArticles;
import Image from "next/image";
import Link from "next/link";
import { getAllPostByRankNext } from "@/service/api/post";
import { cache } from "react";
import clsx from "clsx";
import { URL } from "@/constants/Common";

import LazyLoadImage from "@/components/LazyLoadImage";

const getPostByRank = cache(getAllPostByRankNext);

const FeaturedArticles = async () => {
  let dataPost = null;
  try {
    const response = await getPostByRank(1, 13,false);
    if (response.status === 200) {
      dataPost = response.data.data;
    }
  } catch (error) {}

  return (
    <>
      {dataPost && dataPost.length > 0 && (
        <section className="mx-auto p-6 rounded-xl border border-gray-300/50 dark:border-gray-800/50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/30 shadow-lg dark:shadow-none">
          {/* Section Title */}
          {/* <div className="mb-8">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 inline-block">
              Featured Articles
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mt-2 rounded-full"></div>
          </div> */}

          {/* Featured Article */}
          <div className="flex flex-col md:flex-row gap-6 mb-10 group">
            {/* Image */}
            <div className="md:w-1/2 overflow-hidden group-hover:border-purple-500/30 transition-colors duration-300">
              <Link
                title={dataPost[0]?.description}
                href={`${URL}/${dataPost[0]?.slug}`}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <LazyLoadImage
                    height={"h-64"}
                    width={"w-full"}
                    options={{
                      src: dataPost[0]?.thumbnail,
                      alt: dataPost[0]?.description,
                      width: 600,
                      height: 400,
                      className:
                        "h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105",
                      loading: "lazy",
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* Text Content */}
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <Link
                  title={dataPost[0]?.title}
                  href={`${URL}/${dataPost[0]?.slug}`}
                >
                  <h3 className="text-2xl line-clamp-3 font-bold mb-3 text-blue-700 dark:text-white hover:text-purple-600 dark:hover:text-purple-300 transition duration-300 ease-in-out">
                    {dataPost[0]?.title}
                  </h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-5">
                  {dataPost[0]?.description}
                </p>
                <Link
                  title="Xem tiếp"
                  className={clsx(
                    "px-4 py-2 rounded-full transition duration-300 ease-in-out",
                    "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700",
                    "sm:px-6 sm:py-3",
                    "flex justify-center sm:inline-flex"
                  )}
                  href={`${URL}/${dataPost[0]?.slug}`}
                >
                  Xem tiếp
                </Link>
              </div>
            </div>
          </div>

          {/* Grid of Smaller Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataPost.map((post, index) => {
              if (index >= 1) {
                return (
                  <div
                    key={index}
                    className="flex flex-col group bg-gray-100/50 dark:bg-gray-900/20 rounded-lg p-3 border border-gray-300/50 dark:border-gray-800/50 hover:border-purple-500/50 dark:hover:border-purple-500/30 transition-all duration-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/30"
                  >
                    <div className="flex-shrink-0 overflow-hidden rounded-lg mb-3">
                      <Link
                        title={post.description}
                        href={`${URL}/${post.slug}`}
                      >
                        <div className="overflow-hidden">
                          <LazyLoadImage
                            height={"h-44"}
                            width={"w-full"}
                            options={{
                              src: post.thumbnail,
                              alt: post.description,
                              width: 300,
                              height: 200,
                              className:
                                "h-44 object-cover w-full mx-auto transition-transform duration-500 group-hover:scale-105",
                              loading: "lazy",
                            }}
                          />
                        </div>
                      </Link>
                    </div>
                    {/* Title */}
                    <div className="mt-2">
                      <Link title={post.title} href={`${URL}/${post.slug}`}>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300 transition duration-300 ease-in-out line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* View all link */}
          {/* <div className="mt-8 text-center">
            <Link 
              href="/articles"
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-purple-600/50 hover:bg-purple-600/70 rounded-full transition-colors duration-300"
            >
              Xem tất cả bài viết
              <span className="ml-2">→</span>
            </Link>
          </div> */}
        </section>
      )}
    </>
  );
};

export default FeaturedArticles;