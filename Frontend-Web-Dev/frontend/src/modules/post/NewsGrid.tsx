// import Link from "next/link";
// import clsx from "clsx";
// import { getAllPostByCategoryPublicNext } from "@/service/api/post";
// import { getDetailTagBySlugNext } from "@/service/api/tag";
// import { cache } from "react";
// import { URL } from "@/constants/Common";

// import LazyLoadImage from "@/components/LazyLoadImage";

// type NewsGridProps = {
//   slug: string[];
// };

// const getDetailTagBySlug = cache(getDetailTagBySlugNext);
// const getAllPostByCategoryPublic = cache(getAllPostByCategoryPublicNext);

// const NewsGrid = async (props: NewsGridProps) => {
//   let dataPost = null;
//   let dataTag = null;

//   try {
//     const response = await getAllPostByCategoryPublic(1, 4, [
//       ...(props.slug || ""),
//     ]);
//     if (response.status === 200) {
//       dataPost = response.data.data;
//     }
//   } catch (error) {}

//   try {
//     const response = await getDetailTagBySlug(props.slug || []);
//     if (response.status === 200) {
//       dataTag = response.data.data;
//     }
//   } catch (error) {}

//   return (
//     <>
//       {dataPost && dataPost.length > 0 && (
//         <section className="mx-auto p-4">
//           {/* Category Header */}
//           {dataTag && dataTag.length > 0 && (
//             <div className="mb-4">
//               <Link
//                 title={dataTag[0]?.name}
//                 href={`${URL}/chu-de/${dataTag[0]?.slug}`}
//               >
//                 <h2 className="text-2xl font-bold text-purple-400 uppercase hover:text-purple-300 transition duration-300 ease-in-out">
//                   {dataTag[0]?.name}
//                 </h2>
//               </Link>
//               <div className="flex space-x-2 text-gray-300 text-sm">
//                 {dataTag[0]?.child.length > 0 &&
//                   dataTag[0]?.child.map((tag, index) => {
//                     if (index <= 2) {
//                       return (
//                         <Link
//                           key={index}
//                           title={tag.name}
//                           href={`${URL}/chu-de/${dataTag[0]?.slug}/${tag.slug}`}
//                           className="hover:text-cyan-300 transition duration-200"
//                         >
//                           <span className="text-gray-500">• </span>
//                           {tag.name}
//                         </Link>
//                       );
//                     } else if (index === 3) {
//                       return (
//                         <span key={index} className="text-gray-400">
//                           ...
//                         </span>
//                       );
//                     } else {
//                       return null;
//                     }
//                   })}
//               </div>
//             </div>
//           )}

//           {/* 2x2 Grid of Articles */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {dataPost.map((post, index) => {
//               if (index >= 4) {
//                 return null;
//               }
//               return (
//                 <div key={index} className="flex flex-col bg-purple-900 bg-opacity-20 rounded-lg overflow-hidden hover:bg-opacity-30 transition duration-300">
//                   <Link 
//                     title={post.description} 
//                     href={`${URL}/${post.slug}`}
//                     className="block overflow-hidden border-b border-purple-800"
//                   >
//                     <LazyLoadImage
//                       height={"h-52 sm:h-40"}
//                       width={"w-full"}
//                       options={{
//                         src: post.thumbnail,
//                         alt: post.description,
//                         width: 300,
//                         height: 200,
//                         className:
//                           "w-full h-52 sm:h-40 object-cover hover:opacity-80 transition duration-200",
//                         loading: "lazy",
//                       }}
//                     />
//                   </Link>
//                   <div className="p-3">
//                     <Link title={post.title} href={`${URL}/${post.slug}`}>
//                       <h3
//                         className={clsx(
//                           "text-sm font-semibold mb-1 text-gray-100 transition duration-200",
//                           "hover:text-cyan-300",
//                           "line-clamp-3"
//                         )}
//                       >
//                         {post.title}
//                       </h3>
//                     </Link>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* View More Link */}
//           {dataTag && dataTag.length > 0 && (
//             <div className="mt-4 text-center md:text-end">
//               <Link
//                 title="Xem thêm"
//                 className={clsx(
//                   "bg-purple-900 text-gray-200 px-3 py-1 rounded-full",
//                   "hover:bg-purple-700 transition",
//                   "italic",
//                   "text-sm md:text-xs border border-purple-600"
//                 )}
//                 href={`${URL}/chu-de/${dataTag[0]?.slug}`}
//               >
//                 Xem thêm
//               </Link>
//             </div>
//           )}
//         </section>
//       )}
//     </>
//   );
// };

// export default NewsGrid;
import Link from "next/link";
import clsx from "clsx";
import { getAllPostByCategoryPublicNext } from "@/service/api/post";
import { getDetailTagBySlugNext } from "@/service/api/tag";
import { cache } from "react";
import { URL } from "@/constants/Common";

import LazyLoadImage from "@/components/LazyLoadImage";

type NewsGridProps = {
  slug: string[];
};

const getDetailTagBySlug = cache(getDetailTagBySlugNext);
const getAllPostByCategoryPublic = cache(getAllPostByCategoryPublicNext);

const NewsGrid = async (props: NewsGridProps) => {
  let dataPost = null;
  let dataTag = null;

  try {
    const response = await getAllPostByCategoryPublic(1, 4, [
      ...(props.slug || ""),
    ]);
    if (response.status === 200) {
      dataPost = response.data.data;
    }
  } catch (error) {}

  try {
    const response = await getDetailTagBySlug(props.slug || []);
    if (response.status === 200) {
      dataTag = response.data.data;
    }
  } catch (error) {}

  return (
    <>
      {dataPost && dataPost.length > 0 && (
        <section className="mx-auto p-4">
          {/* Category Header */}
          {dataTag && dataTag.length > 0 && (
            <div className="mb-4">
              <Link
                title={dataTag[0]?.name}
                href={`${URL}/chu-de/${dataTag[0]?.slug}`}
              >
                <h2 className={
                  clsx(
                    "text-2xl font-bold transition duration-300 ease-in-out",
                    "text-purple-600 dark:text-purple-400 uppercase hover:text-purple-700 dark:hover:text-purple-300"
                  )
                }>
                  {dataTag[0]?.name}
                </h2>
              </Link>
              <div className="flex space-x-2 text-gray-600 dark:text-gray-300 text-sm">
                {dataTag[0]?.child.length > 0 &&
                  dataTag[0]?.child.map((tag, index) => {
                    if (index <= 2) {
                      return (
                        <Link
                          key={index}
                          title={tag.name}
                          href={`${URL}/chu-de/${dataTag[0]?.slug}/${tag.slug}`}
                          className="hover:text-violet-500 dark:hover:text-cyan-300 transition duration-200"
                        >
                          <span className="text-gray-400 dark:text-gray-500">• </span>
                          {tag.name}
                        </Link>
                      );
                    } else if (index === 3) {
                      return (
                        <span key={index} className="text-gray-500 dark:text-gray-400">
                          ...
                        </span>
                      );
                    } else {
                      return null;
                    }
                  })}
              </div>
            </div>
          )}

          {/* 2x2 Grid of Articles */}
          <div className={
            clsx(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
              //đổ bóng
              "bg-white dark:bg-slate-900 bg-opacity-80 dark:bg-opacity-40 p-6 rounded-lg shadow-lg dark:shadow-none",

            )
          }>
            {dataPost.map((post, index) => {
              if (index >= 4) {
                return null;
              }
              return (
                <div key={index} className="flex flex-col bg-purple-100 dark:bg-purple-900 bg-opacity-50 dark:bg-opacity-20 rounded-lg overflow-hidden hover:bg-purple-200 hover:bg-opacity-60 dark:hover:bg-opacity-30 transition duration-300">
                  <Link 
                    title={post.description} 
                    href={`${URL}/${post.slug}`}
                    className="block overflow-hidden border-b border-purple-300 dark:border-purple-800"
                  >
                    <LazyLoadImage
                      height={"h-52 sm:h-40"}
                      width={"w-full"}
                      options={{
                        src: post.thumbnail,
                        alt: post.description,
                        width: 300,
                        height: 200,
                        className:
                          "w-full h-52 sm:h-40 object-cover hover:opacity-80 transition duration-200",
                        loading: "lazy",
                      }}
                    />
                  </Link>
                  <div className="p-3">
                    <Link title={post.title} href={`${URL}/${post.slug}`}>
                      <h3
                        className={clsx(
                          "text-sm font-semibold mb-1 text-blue-700 dark:text-gray-100 transition duration-200",
                          "hover:text-violet-600 dark:hover:text-cyan-300",
                          "line-clamp-3"
                        )}
                      >
                        {post.title}
                      </h3>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View More Link */}
          {dataTag && dataTag.length > 0 && (
            <div className="mt-4 text-center md:text-end">
              <Link
                title="Xem thêm"
                className={clsx(
                  "bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-gray-200 px-3 py-1 rounded-full",
                  "hover:bg-purple-300 dark:hover:bg-purple-700 transition",
                  "italic",
                  "text-sm md:text-xs border border-purple-400 dark:border-purple-600"
                )}
                href={`${URL}/chu-de/${dataTag[0]?.slug}`}
              >
                Xem thêm
              </Link>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default NewsGrid;