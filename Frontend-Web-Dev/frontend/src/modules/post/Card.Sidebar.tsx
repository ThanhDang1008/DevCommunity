// import Link from "next/link";
// import clsx from "clsx";
// import { getAllPostByCategoryPublicNext } from "@/service/api/post";
// import { getDetailTagBySlugNext } from "@/service/api/tag";
// import { cache } from "react";
// import { URL } from "@/constants/Common";

// import LazyLoadImage from "@/components/LazyLoadImage";

// type CardProps = {
//   slug: string[];
// };

// const getDetailTagBySlug = cache(getDetailTagBySlugNext);
// const getAllPostByCategoryPublic = cache(getAllPostByCategoryPublicNext);

// const Card = async (props: CardProps) => {
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
//         <section>
//           {/* Category Header */}
//           {dataTag && dataTag.length > 0 && (
//             <div className="text-cyan-400">
//               <h2 className="text-lg font-bold hover:opacity-80 transition duration-200">
//                 <Link
//                   title={dataTag[0]?.name}
//                   href={`${URL}/chu-de/${dataTag[0]?.slug}`}
//                 >
//                   {dataTag[0]?.name}
//                 </Link>
//               </h2>
//             </div>
//           )}

//           <hr className="border-t border-cyan-600 mb-2" />
//           <div className="max-w-sm mx-auto bg-purple-900 bg-opacity-30 backdrop-blur-sm rounded-md px-3 py-3 shadow-lg border border-purple-800">
//             {/* Main Image Section */}
//             <div className="overflow-hidden rounded-md">
//               <Link
//                 title={dataPost[0]?.description}
//                 href={`${URL}/${dataPost[0]?.slug}`}
//               >
//                 <LazyLoadImage
//                   height={"h-44"}
//                   width={"w-full"}
//                   options={{
//                     src: dataPost[0]?.thumbnail,
//                     alt: dataPost[0]?.description,
//                     className:
//                       "w-full h-44 object-cover rounded-md hover:opacity-80 hover:scale-105 transition duration-300",
//                     loading: "lazy",
//                     width: 300,
//                     height: 200,
//                   }}
//                 />
//               </Link>
//             </div>
//             {/* Title Below Main Image */}
//             <div className="mt-2 mb-2">
//               <Link
//                 title={dataPost[0]?.title}
//                 href={`${URL}/${dataPost[0]?.slug}`}
//               >
//                 <h3 className="text-lg font-semibold text-white hover:text-cyan-300 transition duration-200">
//                   {dataPost[0]?.title}
//                 </h3>
//               </Link>
//             </div>
//             <hr className="border-t border-purple-700 mb-2" />
//             <div className="flex flex-col gap-4">
//               {dataPost.map((post, index) => {
//                 if (index >= 4 || index === 0) {
//                   return null;
//                 }
//                 return (
//                   <div key={index} className="flex gap-4 group hover:bg-purple-800 hover:bg-opacity-30 p-1 rounded-md transition duration-200">
//                     <div className="flex-shrink-0">
//                       <Link
//                         title={post.description}
//                         href={`${URL}/${post.slug}`}
//                       >
//                         <LazyLoadImage
//                           height={"h-12"}
//                           width={"w-20"}
//                           options={{
//                             src: post.thumbnail,
//                             alt: post.description,
//                             width: 150,
//                             height: 100,
//                             className:
//                               "h-12 w-20 rounded-lg hover:opacity-80 transition duration-200",
//                             loading: "lazy",
//                             style: { objectFit: "cover" },
//                           }}
//                         />
//                       </Link>
//                     </div>

//                     <div>
//                       <Link title={post.title} href={`${URL}/${post.slug}`}>
//                         <h3 className="text-sm text-gray-300 line-clamp-2 group-hover:text-cyan-300 transition duration-200">
//                           {post.title}
//                         </h3>
//                       </Link>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>
//       )}
//     </>
//   );
// };

// export default Card;
import Link from "next/link";
import clsx from "clsx";
import { getAllPostByCategoryPublicNext } from "@/service/api/post";
import { getDetailTagBySlugNext } from "@/service/api/tag";
import { cache } from "react";
import { URL } from "@/constants/Common";

import LazyLoadImage from "@/components/LazyLoadImage";

type CardProps = {
  slug: string[];
};

const getDetailTagBySlug = cache(getDetailTagBySlugNext);
const getAllPostByCategoryPublic = cache(getAllPostByCategoryPublicNext);

const Card = async (props: CardProps) => {
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
        <section>
          {/* Category Header */}
          {dataTag && dataTag.length > 0 && (
            <div className="text-violet-600 dark:text-cyan-400">
              <h2 className="text-lg font-bold hover:opacity-80 transition duration-200">
                <Link
                  title={dataTag[0]?.name}
                  href={`${URL}/chu-de/${dataTag[0]?.slug}`}
                >
                  {dataTag[0]?.name}
                </Link>
              </h2>
            </div>
          )}

          <hr className="border-t border-violet-400 dark:border-cyan-600 mb-2" />
          <div className="max-w-sm mx-auto bg-white dark:bg-purple-900 bg-opacity-80 dark:bg-opacity-30 backdrop-blur-sm rounded-md px-3 py-3 shadow-lg border border-purple-200 dark:border-purple-800">
            {/* Main Image Section */}
            <div className="overflow-hidden rounded-md">
              <Link
                title={dataPost[0]?.description}
                href={`${URL}/${dataPost[0]?.slug}`}
              >
                <LazyLoadImage
                  height={"h-44"}
                  width={"w-full"}
                  options={{
                    src: dataPost[0]?.thumbnail,
                    alt: dataPost[0]?.description,
                    className:
                      "w-full h-44 object-cover rounded-md hover:opacity-80 hover:scale-105 transition duration-300",
                    loading: "lazy",
                    width: 300,
                    height: 200,
                  }}
                />
              </Link>
            </div>
            {/* Title Below Main Image */}
            <div className="mt-2 mb-2">
              <Link
                title={dataPost[0]?.title}
                href={`${URL}/${dataPost[0]?.slug}`}
              >
                <h3 className={
                  clsx(
                    "text-lg font-semibold transition duration-200",
                    "text-gray-800 dark:text-white hover:text-violet-500 dark:hover:text-cyan-300"
                  )
                }>
                  {dataPost[0]?.title}
                </h3>
              </Link>
            </div>
            <hr className="border-t border-purple-300 dark:border-purple-700 mb-2" />
            <div className="flex flex-col gap-4">
              {dataPost.map((post, index) => {
                if (index >= 4 || index === 0) {
                  return null;
                }
                return (
                  <div key={index} className="flex gap-4 group hover:bg-purple-100 dark:hover:bg-purple-800 hover:bg-opacity-50 dark:hover:bg-opacity-30 p-1 rounded-md transition duration-200">
                    <div className="flex-shrink-0">
                      <Link
                        title={post.description}
                        href={`${URL}/${post.slug}`}
                      >
                        <LazyLoadImage
                          height={"h-12"}
                          width={"w-20"}
                          options={{
                            src: post.thumbnail,
                            alt: post.description,
                            width: 150,
                            height: 100,
                            className:
                              "h-12 w-20 rounded-lg hover:opacity-80 transition duration-200",
                            loading: "lazy",
                            style: { objectFit: "cover" },
                          }}
                        />
                      </Link>
                    </div>

                    <div>
                      <Link title={post.title} href={`${URL}/${post.slug}`}>
                        <h3 className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 group-hover:text-violet-500 dark:group-hover:text-cyan-300 transition duration-200">
                          {post.title}
                        </h3>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Card;