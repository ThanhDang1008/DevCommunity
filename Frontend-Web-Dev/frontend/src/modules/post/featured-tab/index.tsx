"use client";

import "./featured-tab.scss";
import { Tabs } from "antd";
// import Image from "next/image";
import Link from "next/link";
import type { TabsProps } from "antd";
import { getAllPostByViewPublic } from "@/service/api/post";
import { getAllPostByViewPublicNext } from "@/service/api/post/actions";
import type { Post } from "@/service/api/post/types";

// import { useQuery } from "@tanstack/react-query";
import { queryKeys, URL } from "@/constants/Common";

import LazyLoadImage from "@/components/LazyLoadImage";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface SidebarArticle {
  title: string;
  imageUrl: string;
  description?: string;
}

const featuredArticles: SidebarArticle[] = [
  {
    title:
      "Hơn 500 Tăng Ni, Phật tử tham dự Lễ khánh đản Bồ-tát Quán Thế Âm tại chùa Phật Quốc Vạn Thành",
    imageUrl:
      "https://files.vnews247.com/image/giavangminhhien8-okok-137992-67140-1743340032288.gif",
  },
  {
    title: "Hiền tượng “địa phương tuyên tần” phông giáo phạm",
    imageUrl:
      "https://files.vnews247.com/image/giavangminhhien8-okok-137992-67140-1743340032288.gif",
  },
  {
    title:
      "Long An: Công bố quyết định thành lập, bổ nhiệm trụ trì và Ban Quản trị tinh thất Duộc",
    imageUrl:
      "https://files.vnews247.com/image/giavangminhhien8-okok-137992-67140-1743340032288.gif",
  },
  {
    title:
      "Long An: Công bố quyết định thành lập, bổ nhiệm trụ trì và Ban Quản trị tinh thất Duộc",
    imageUrl:
      "https://files.vnews247.com/image/giavangminhhien8-okok-137992-67140-1743340032288.gif",
  },
];

const hotArticles: SidebarArticle[] = [
  {
    title: "Kể tri pháp tại gia sao được gọi Tỳ-kheo?",
    imageUrl:
      "https://files.vnews247.com/image/giavangminhhien8-okok-137992-67140-1743340032288.gif",
  },
  {
    title:
      "Ban Trị sự Phật giáo Q.4 sẽ tổ chức rước kiệu Phật chưc ngày 8-4 Âm lịch",
    imageUrl:
      "https://files.vnews247.com/image/giavangminhhien8-okok-137992-67140-1743340032288.gif",
  },
];

const ArticleList = ({ articles }: { articles: Omit<Post, "content">[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {articles.map((article, index) => {
        return (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0">
              <Link title={article.title} href={`${URL}/${article.slug}`}>
                {/* <Image
                  src={article.thumbnail}
                  alt={article.description}
                  width={100}
                  height={100}
                  className="h-12 w-20 object-cover rounded-lg hover:opacity-80 transition duration-200"
                  loading="lazy"
                /> */}
                <LazyLoadImage
                  height={"h-12"}
                  width={"w-20"}
                  options={{
                    src: article.thumbnail,
                    alt: article.description,
                    width: 150,
                    height: 100,
                    className:
                      "h-12 w-20 object-cover rounded-lg hover:opacity-80 transition duration-200",
                    loading: "lazy",
                  }}
                />
              </Link>
            </div>
            <div>
              <Link title={article.title} href={`${URL}/${article.slug}`}>
                <h3 className={
                  clsx(
                    "text-sm font-semibold  line-clamp-2 transition duration-200",
                    "dark:text-gray-300 dark:hover:text-[#2fa1b3]"
                  )
                }>
                  {article.title}
                </h3>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FeaturedTab = () => {
  const onChange = (key: string) => {
    //console.log(`Tab selected: ${key}`);
  };

  // const {
  //   data: dataPost,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: [queryKeys.GET_ALL_POST_BY_VIEW],
  //   queryFn: () => getAllPostByViewPublic(1, 10),
  //   gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
  //   refetchOnReconnect: false,
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false, //fetch dữ liệu khi mount component
  //   refetchInterval: false, //thời gian tự động fetch lại dữ liệu
  //   retry: 3,
  //   retryDelay: 2000,
  //   retryOnMount: true,
  // });
  const [dataPost, setDataPost] = useState<Omit<Post, "content">[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPostByViewPublicNext(1, 10);
        if (response.status === 200) {
          setDataPost(response?.data?.data || []);
        }
      } catch (error) {
        //console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  //console.log("dataPost: ", dataPost);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "TIN NỔI BẬT",
      children: <ArticleList articles={dataPost || []} />,
    },
    // {
    //   key: "2",
    //   label: "TIN NÓNG",
    //   children: <ArticleList articles={dataPost?.data?.data || []} />,
    // },
  ];

  return (
    <>
      {dataPost && dataPost?.length > 0 && (
        <div
          className={`side-bar-featured-tab`}
        >
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      )}
    </>
  );
};

export default FeaturedTab;
