"use client";

import { Pagination } from "antd";
import clsx from "clsx";
import { useState, useEffect } from "react";

type PaginationCategoryProps = {
  totalPosts: number;
  limitPostCategory: number;
  pagePostCategory: number;
  slug: string;
  currentPage: number;
};

const PaginationCategory = (props: PaginationCategoryProps) => {
  const totalPages = Math.ceil(props.totalPosts / props.limitPostCategory);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient && (
        <Pagination
          showSizeChanger={false}
          showQuickJumper={false}
          itemRender={(page, type, element) => {
            if (type === "prev") {
              if (props.currentPage === 1) {
                return (
                  <span
                    title="Trang trước"
                    className="text-gray-400 hover:text-gray-400 cursor-not-allowed px-3 py-2"
                  >
                    {"<"}
                  </span>
                );
              }
              return (
                <a
                  title="Trang trước"
                  className={clsx(
                    "text-white hover:text-white font-semibold px-3 py-2 bg-purple-700 hover:bg-purple-600 transition-colors duration-200 rounded-md border border-purple-500"
                  )}
                  href={`/chu-de/${props.slug}?p=${props.currentPage - 1}`}
                >
                  {"<"}
                </a>
              );
            }
            if (type === "page") {
              return (
                <a
                  title={`Trang ${page}`}
                  className={clsx(
                    "flex items-center justify-center min-w-[36px] h-9 rounded-md transition-colors duration-200",
                    page === props.currentPage ? "" : " "
                  )}
                  href={`/chu-de/${props.slug}?p=${page}`}
                  style={{
                    color: "rgb(109 0 204)",
                  }}
                >
                  {page === props.currentPage ? (
                    <span className="font-bold underline">{page}</span>
                  ) : (
                    <span className="">{page}</span>
                  )}
                </a>
              );
            }

            if (type === "next") {
              if (props.currentPage === totalPages) {
                return (
                  <span
                    title="Trang sau"
                    className="text-gray-400 hover:text-gray-400 cursor-not-allowed px-3 py-2"
                  >
                    {">"}
                  </span>
                );
              }

              return (
                <a
                  title="Trang sau"
                  className={clsx(
                    "text-white hover:text-white font-semibold px-3 py-2 bg-purple-700 hover:bg-purple-600 transition-colors duration-200 rounded-md border border-purple-500"
                  )}
                  href={`/chu-de/${props.slug}?p=${props.currentPage + 1}`}
                >
                  {">"}
                </a>
              );
            }

            if (type === "jump-next" || type === "jump-prev") {
              const pageTarget =
                type === "jump-next"
                  ? props.currentPage + 5 > totalPages
                    ? totalPages
                    : props.currentPage + 5
                  : props.currentPage - 5 < 1
                  ? 1
                  : props.currentPage - 5;

              const title =
                type === "jump-next" ? "5 trang sau" : "5 trang trước";

              return (
                <a
                  title={title}
                  className={clsx(
                    "mx-1 flex items-center justify-center min-w-[36px] h-9 rounded-md",
                    "text-cyan-300 hover:text-cyan-200 font-semibold transition-colors duration-200"
                  )}
                  href={`/chu-de/${props.slug}?p=${pageTarget}`}
                >
                  <span className="text-xl">...</span>
                </a>
              );
            }
            return element;
          }}
          defaultPageSize={Number(props.limitPostCategory)}
          defaultCurrent={Number(props.pagePostCategory)}
          total={props.totalPosts}
        />
      )}
    </>
  );
};

export default PaginationCategory;
