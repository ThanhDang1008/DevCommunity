import type { ITag } from "@/service/api/tag/types";
import clsx from "clsx";
import Link from "next/link";
import { Fragment } from "react";

type CategoryProps = {
  category: ITag[];
};

const Categories = ({ category }: CategoryProps) => {
  //console.log("Category: ", category);
  return (
    <>
      {category?.[0]?._id && (
        <div className="flex items-center mb-4 flex-wrap">
          <Link
            title={category?.[0]?.name}
            href={`/chu-de/${category?.[0]?.slug}`}
            className={clsx(
              "text-2xl font-bold transition duration-300",
              "dark:text-violet-300 dark:hover:text-violet-200",
              "text-violet-900 hover:text-violet-500"
            )}
          >
            {category?.[0]?.name}
          </Link>
          {category?.[0]?.child?.[0]?._id && (
            <Fragment>
              <span
                className={clsx(
                  "ml-2 font-medium mx-2 flex items-center",
                  "dark:text-violet-500 text-violet-900"
                )}
              >
                <i className="bi bi-caret-right-fill text-lg"></i>
              </span>
              <Link
                title={category?.[0]?.child[0]?.name}
                href={`/chu-de/${category?.[0]?.slug}/${category?.[0]?.child?.[0]?.slug}`}
                className={clsx(
                  " bg-opacity-70 px-3 py-1 rounded-full mr-2 flex items-center  transition duration-300 backdrop-blur-sm border  shadow-sm shadow-violet-900/50",
                  "dark:bg-violet-800 dark:text-violet-200 border-violet-700/50 dark:hover:bg-violet-700 hover:text-white",
                  "bg-violet-100 text-violet-600 hover:bg-violet-600"
                )}
              >
                {category?.[0]?.child?.[0]?.name}
              </Link>
            </Fragment>
          )}
        </div>
      )}
    </>
  );
};

export default Categories;
