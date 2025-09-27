// import Link from "next/link";
// import clsx from "clsx";
// import { getAllPostByCategoryPublicNext } from "@/service/api/post";
// import { getDetailTagBySlugNext } from "@/service/api/tag";
// import { cache } from "react";
// import { URL } from "@/constants/Common";

// import LazyLoadImage from "@/components/LazyLoadImage";

// type CategoriesListProps = {
//   slug: string[];
// };

// const getDetailTagBySlug = cache(getDetailTagBySlugNext);
// const getAllPostByCategoryPublic = cache(getAllPostByCategoryPublicNext);

// const CategoriesList = async (props: CategoriesListProps) => {
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
//         <section className="mx-auto p-4 bg-transparent">
//           {/* Category Header */}
//           {dataTag && dataTag.length > 0 && (
//             <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
//               <Link
//                 title={dataTag[0]?.name}
//                 href={`${URL}/chu-de/${dataTag[0]?.slug}`}
//               >
//                 <h2 className="text-2xl font-bold text-purple-400 uppercase hover:text-purple-300 transition duration-300 ease-in-out">
//                   {dataTag[0]?.name}
//                 </h2>
//               </Link>
//               <div className="flex space-x-2 text-gray-300 text-sm">
//                 <>
//                   {dataTag[0]?.child.length > 0 &&
//                     dataTag[0]?.child.map((tag, index) => {
//                       if (index <= 2) {
//                         return (
//                           <Link
//                             key={index}
//                             title={tag.name}
//                             href={`${URL}/chu-de/${dataTag[0]?.slug}/${tag.slug}`}
//                             className="hover:text-cyan-300 transition duration-300 ease-in-out"
//                           >
//                             <span className="text-gray-500">• </span>
//                             {tag.name}
//                           </Link>
//                         );
//                       } else if (index === 3) {
//                         return (
//                           <span key={index} className="text-gray-400">
//                             ...
//                           </span>
//                         );
//                       } else {
//                         return null;
//                       }
//                     })}
//                 </>
//               </div>
//             </div>
//           )}

//           {/* Main Layout: Featured Article + Related Articles */}
//           <div className="flex flex-col lg:flex-row gap-4">
//             {/* Featured Article */}
//             <div className="lg:w-2/3">
//               <Link
//                 title={dataPost[0].description}
//                 href={`${URL}/${dataPost[0].slug}`}
//                 className="block rounded-lg overflow-hidden border border-purple-800 hover:border-purple-500 transition duration-300"
//               >
//                 <LazyLoadImage
//                   height={"h-64"}
//                   width={"w-full"}
//                   options={{
//                     src: dataPost[0].thumbnail,
//                     alt: dataPost[0].description,
//                     width: 400,
//                     height: 300,
//                     className:
//                       "w-full h-64 object-cover hover:opacity-80 transition duration-200",
//                     loading: "lazy",
//                   }}
//                 />
//               </Link>
//               <div className="mt-3 p-2">
//                 <Link
//                   title={dataPost[0].title}
//                   href={`${URL}/${dataPost[0].slug}`}
//                 >
//                   <h3 className="text-xl font-semibold mb-1 text-white hover:text-cyan-300 transition duration-300 ease-in-out line-clamp-2">
//                     {dataPost[0].title}
//                   </h3>
//                 </Link>
//                 <p className="text-gray-300 text-sm">{dataPost[0].description}</p>
//               </div>
//             </div>

//             {/* Related Articles */}
//             <div className="lg:w-1/3 space-y-4 flex flex-col gap-4">
//               {dataPost.map((post, index) => {
//                 if (index >= 4 || index === 0) {
//                   return null;
//                 }
//                 return (
//                   <div key={index} className="flex gap-3 p-2 rounded-lg bg-opacity-20 bg-purple-900 hover:bg-opacity-30 transition duration-300">
//                     <div className="flex-shrink-0">
//                       <Link
//                         title={post.description}
//                         href={`${URL}/${post.slug}`}
//                         className="block rounded overflow-hidden border border-purple-800"
//                       >
//                         <LazyLoadImage
//                           height={"h-20"}
//                           width={"w-24"}
//                           options={{
//                             src: post.thumbnail,
//                             alt: post.description,
//                             width: 150,
//                             height: 100,
//                             className:
//                               "w-24 h-20 object-cover hover:opacity-80 transition duration-200",
//                             loading: "lazy",
//                           }}
//                         />
//                       </Link>
//                     </div>
//                     {/* Title */}
//                     <div>
//                       <Link title={post.title} href={`${URL}/${post.slug}`}>
//                         <h3 className="text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition duration-300 ease-in-out line-clamp-3">
//                           {post.title}
//                         </h3>
//                       </Link>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//           {/* Button to view more articles */}
//           {dataTag && dataTag.length > 0 && (
//             <div className="mt-5 text-center md:text-end">
//               <Link
//                 title="Xem thêm"
//                 className={clsx(
//                   "bg-purple-900 text-gray-200 px-3 py-1 rounded-full",
//                   "hover:bg-purple-700 transition",
//                   "italic",
//                   "text-sm text-gray-200 md:text-xs border border-purple-600"
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

// export default CategoriesList;
import Link from "next/link";
import clsx from "clsx";
import { getAllPostByCategoryPublicNext } from "@/service/api/post";
import { getDetailTagBySlugNext } from "@/service/api/tag";
import { cache } from "react";
import { URL } from "@/constants/Common";

import LazyLoadImage from "@/components/LazyLoadImage";

type CategoriesListProps = {
  slug: string[];
};

const getDetailTagBySlug = cache(getDetailTagBySlugNext);
const getAllPostByCategoryPublic = cache(getAllPostByCategoryPublicNext);

const CategoriesList = async (props: CategoriesListProps) => {
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
        <section className="mx-auto p-4 bg-transparent">
          {/* Category Header */}
          {dataTag && dataTag.length > 0 && (
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
              <Link
                title={dataTag[0]?.name}
                href={`${URL}/chu-de/${dataTag[0]?.slug}`}
              >
                <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 uppercase hover:text-purple-700 dark:hover:text-purple-300 transition duration-300 ease-in-out">
                  {dataTag[0]?.name}
                </h2>
              </Link>
              <div className="flex space-x-2 text-gray-600 dark:text-gray-300 text-sm">
                <>
                  {dataTag[0]?.child.length > 0 &&
                    dataTag[0]?.child.map((tag, index) => {
                      if (index <= 2) {
                        return (
                          <Link
                            key={index}
                            title={tag.name}
                            href={`${URL}/chu-de/${dataTag[0]?.slug}/${tag.slug}`}
                            className="hover:text-violet-500 dark:hover:text-cyan-300 transition duration-300 ease-in-out"
                          >
                            <span className="text-gray-400 dark:text-gray-500">
                              •{" "}
                            </span>
                            {tag.name}
                          </Link>
                        );
                      } else if (index === 3) {
                        return (
                          <span
                            key={index}
                            className="text-gray-500 dark:text-gray-400"
                          >
                            ...
                          </span>
                        );
                      } else {
                        return null;
                      }
                    })}
                </>
              </div>
            </div>
          )}

          {/* Main Layout: Featured Article + Related Articles */}

          <div
            className={clsx(
              "flex flex-col lg:flex-row gap-4",
              "bg-white dark:bg-slate-900 bg-opacity-80 dark:bg-opacity-40 p-6 rounded-lg shadow-lg dark:shadow-none"
            )}
          >
            {/* Featured Article */}
            <div className="lg:w-2/3">
              <Link
                title={dataPost[0].description}
                href={`${URL}/${dataPost[0].slug}`}
                className="block rounded-lg overflow-hidden border border-purple-300 dark:border-purple-800 hover:border-purple-500 dark:hover:border-purple-500 transition duration-300"
              >
                <LazyLoadImage
                  height={"h-64"}
                  width={"w-full"}
                  options={{
                    src: dataPost[0].thumbnail,
                    alt: dataPost[0].description,
                    width: 400,
                    height: 300,
                    className:
                      "w-full h-64 object-cover hover:opacity-80 transition duration-200",
                    loading: "lazy",
                  }}
                />
              </Link>
              <div className="mt-3 p-2">
                <Link
                  title={dataPost[0].title}
                  href={`${URL}/${dataPost[0].slug}`}
                >
                  <h3
                    className={clsx(
                      "text-xl font-semibold mb-1 transition duration-300 ease-in-out line-clamp-2",
                      "text-gray-900 dark:text-white hover:text-violet-500 dark:hover:text-cyan-300"
                    )}
                  >
                    {dataPost[0].title}
                  </h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {dataPost[0].description}
                </p>
              </div>
            </div>

            {/* Related Articles */}
            <div className="lg:w-1/3 space-y-4 flex flex-col gap-4">
              {dataPost.map((post, index) => {
                if (index >= 4 || index === 0) {
                  return null;
                }
                return (
                  <div
                    key={index}
                    className="flex gap-3 p-2 rounded-lg bg-purple-100 bg-opacity-50 dark:bg-purple-900 dark:bg-opacity-20 hover:bg-purple-200 hover:bg-opacity-60 dark:hover:bg-opacity-30 transition duration-300"
                  >
                    <div className="flex-shrink-0">
                      <Link
                        title={post.description}
                        href={`${URL}/${post.slug}`}
                        className="block rounded overflow-hidden border border-purple-300 dark:border-purple-800"
                      >
                        <LazyLoadImage
                          height={"h-20"}
                          width={"w-24"}
                          options={{
                            src: post.thumbnail,
                            alt: post.description,
                            width: 150,
                            height: 100,
                            className:
                              "w-24 h-20 object-cover hover:opacity-80 transition duration-200",
                            loading: "lazy",
                          }}
                        />
                      </Link>
                    </div>
                    {/* Title */}
                    <div>
                      <Link title={post.title} href={`${URL}/${post.slug}`}>
                        <h3 className="text-sm font-semibold text-blue-700 dark:text-cyan-300 hover:text-blue-500 dark:hover:text-cyan-200 transition duration-300 ease-in-out line-clamp-3">
                          {post.title}
                        </h3>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Button to view more articles */}
          {dataTag && dataTag.length > 0 && (
            <div className="mt-5 text-center md:text-end">
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

export default CategoriesList;
