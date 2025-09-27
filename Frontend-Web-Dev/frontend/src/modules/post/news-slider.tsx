// import { Carousel } from "antd";
// import Image from "next/image";
// import Link from "next/link";
// import clsx from "clsx";
// import { getAllPostByCategoryPublicNext } from "@/service/api/post";
// import { cache } from "react";
// import { URL } from "@/constants/Common";

// import LazyLoadImage from "@/components/LazyLoadImage";

// type NewsSliderProps = {
//   slug: string[];
// };

// const getAllPostByCategoryPublic = cache(getAllPostByCategoryPublicNext);

// const NewsSlider = async (props: NewsSliderProps) => {
//   let dataPost = null;

//   try {
//     const response = await getAllPostByCategoryPublic(1, 4, [
//       ...(props.slug || ""),
//     ]);
//     if (response.status === 200) {
//       dataPost = response.data.data;
//     }
//   } catch (error) {}

//   return (
//     <>
//       {dataPost && dataPost.length > 0 && (
//         <section>
//           <div className="bg-slate-900 bg-opacity-40 backdrop-blur-sm rounded-lg p-4 mb-6">
//             <h3 className="text-xl font-bold mb-4 text-violet-300 border-b border-violet-700 pb-2">
//               Xem nhanh
//             </h3>
//             <Carousel autoplay arrows infinite={true}>
//               {dataPost.map((post, index) => (
//                 <div key={index} className="relative w-full h-[200px]">
//                   <Image
//                     src={post.thumbnail}
//                     alt={post.description}
//                     fill // Takes up the full width and height of the parent div
//                     className="object-cover w-full h-full z-1"
//                     priority={true}
//                   />
//                   {/* <LazyLoadImage
//               height={"h-[200px]"}
//               width={"w-full"}
//               options={{
//                 src: post.thumbnail,
//                 alt: post.description,
//                 className: "object-cover w-full h-full",
//                 fill: true,
//                 loading: "lazy",
//               }}
//             /> */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
//                     <Link
//                       title={post.title}
//                       href={`${URL}/${post.slug}`}
//                     ></Link>
//                     <Link title={post.title} href={`${URL}/${post.slug}`}>
//                       <h3 className="text-white text-sm font-bold line-clamp-3 hover:text-[#52c5d7] transition duration-200">
//                         {post.title}
//                       </h3>
//                     </Link>

//                     {/* <p className="text-gray-300 mt-2">{slide.description}</p> */}
//                   </div>
//                 </div>
//               ))}
//             </Carousel>
//           </div>
//         </section>
//       )}
//     </>
//   );
// };

// export default NewsSlider;
import { Carousel } from "antd";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { getAllPostByCategoryPublicNext } from "@/service/api/post";
import { cache } from "react";
import { URL } from "@/constants/Common";

import LazyLoadImage from "@/components/LazyLoadImage";

type NewsSliderProps = {
  slug: string[];
};

const getAllPostByCategoryPublic = cache(getAllPostByCategoryPublicNext);

const NewsSlider = async (props: NewsSliderProps) => {
  let dataPost = null;

  try {
    const response = await getAllPostByCategoryPublic(1, 4, [
      ...(props.slug || ""),
    ]);
    if (response.status === 200) {
      dataPost = response.data.data;
    }
  } catch (error) {}

  return (
    <>
      {dataPost && dataPost.length > 0 && (
        <section>
          <div className="bg-white bg-opacity-80 dark:bg-slate-900 dark:bg-opacity-40 backdrop-blur-sm rounded-lg p-4 mb-6 shadow-lg dark:shadow-none">
            <h3 className="text-xl font-bold mb-4 text-violet-600 dark:text-violet-300 border-b border-violet-300 dark:border-violet-700 pb-2">
              Xem nhanh
            </h3>
            <Carousel autoplay arrows infinite={true}>
              {dataPost.map((post, index) => (
                <div key={index} className="relative w-full h-[200px]">
                  <Image
                    src={post.thumbnail}
                    alt={post.description}
                    fill // Takes up the full width and height of the parent div
                    className="object-cover w-full h-full z-1"
                    priority={true}
                  />
                  {/* <LazyLoadImage
              height={"h-[200px]"}
              width={"w-full"}
              options={{
                src: post.thumbnail,
                alt: post.description,
                className: "object-cover w-full h-full",
                fill: true,
                loading: "lazy",
              }}
            /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                    <Link
                      title={post.title}
                      href={`${URL}/${post.slug}`}
                    ></Link>
                    <Link title={post.title} href={`${URL}/${post.slug}`}>
                      <h3 className="text-white text-sm font-bold line-clamp-3 hover:text-cyan-300 dark:hover:text-[#52c5d7] transition duration-200">
                        {post.title}
                      </h3>
                    </Link>

                    {/* <p className="text-gray-300 mt-2">{slide.description}</p> */}
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      )}
    </>
  );
};

export default NewsSlider;
