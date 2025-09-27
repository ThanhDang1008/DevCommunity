"use client";

import { Tooltip, Tag, message } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import clsx from "clsx";

import type { Post } from "@/service/api/post/types";
import { formatToLocalDateTime } from "@/shared/utils/time";
import { statusPost, URL } from "@/constants/Common";
import { useState } from "react";

import ModalDeletePost from "./ModalDeletePost";
import ModalPinPost from "./ModalPinPost";
import ModalUnpinPost from "./ModalUnpinPost";

type ItemPostProps = {
  data: Post;
};

const ItemPost = (props: ItemPostProps) => {
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalPin, setIsOpenModalPin] = useState(false);
  const [isOpenModalUnpin, setIsOpenModalUnpin] = useState(false);
  const router = useRouter();

  //console.log("props.data: ", props);

  return (
    <>
      <article
        className={clsx(
          "relative shadow-lg rounded-xl p-4 sm:p-6 flex flex-col items-start sm:items-center gap-4",
          "hover:shadow-xl transition-shadow duration-300",
          "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
        )}
      >
        <div className="absolute top-[2px] right-[-12px] rotate-45">
          {props.data.rank > 0 && (
            <Tag color="gold" className="text-sm font-medium">
              #{props.data.rank}
            </Tag>
          )}
        </div>
        <div className="flex-shrink-0 w-full m-auto sm:m-0">
          <Link href={`${URL}/${props.data.slug}`}>
            <img
              src={props.data.thumbnail ? props.data.thumbnail : "/image/thumbnail_default.jpg"}
              alt="Thumbnail"
              className="h-32 w-full rounded-lg object-cover hover:opacity-80 transition duration-200"
              loading="lazy"
            />
          </Link>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <Tooltip title={props.data.title}>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-4 sm:line-clamp-2">
                <Link href={`/${props.data.slug}`}>{props.data.title}</Link>
              </h2>
            </Tooltip>
          </div>
          <Tooltip title={props.data.description}>
            <p
              className={clsx(
                "text-sm line-clamp-4 sm:line-clamp-2",
                "text-gray-600 dark:text-gray-300"
              )}
            >
              {props.data.description}
            </p>
          </Tooltip>

          <div
            className={clsx(
              "mt-2 space-y-2 text-sm",
              "text-gray-600 dark:text-gray-300"
            )}
          >
            <p>
              <span className="font-medium">Cập nhật gần nhất:</span>{" "}
              {formatToLocalDateTime(props.data.updatedAt)}{" "}
              {new Date(props.data.createdAt) > new Date() && (
                <Tag icon={<ClockCircleOutlined />} color="default">
                  {formatToLocalDateTime(props.data.createdAt)} (chưa đăng)
                </Tag>
              )}
            </p>
            <p>
              <span className="font-medium">Trạng thái:</span>{" "}
              {props.data.status === statusPost.PUBLIC && (
                <Tag color="success">{props.data.status}</Tag>
              )}
              {props.data.status === statusPost.PRIVATE && (
                <Tag color="warning">{props.data.status}</Tag>
              )}
              {props.data.status === statusPost.SHARED && (
                <Tag color="processing">{props.data.status}</Tag>
              )}
            </p>
            <p>
              <span className="font-medium">Lượt xem:</span> {props.data.view}
            </p>
            <p className="flex flex-wrap items-center gap-1">
              <span className="font-medium">Chủ đề:</span>
              {props?.data?.category?.[0]?._id && (
                <Tag>{props?.data?.category[0]?.name}</Tag>
              )}
              {props?.data?.category?.[0]?.child?.[0]?._id && (
                <Tag>{props?.data?.category[0]?.child[0]?.name}</Tag>
              )}
            </p>
            <p>
              <span className="font-medium">Tác giả:</span>{" "}
              {props.data.author ? (
                <Tooltip title={props.data.author.email}>
                  {props.data.author.fullname}
                </Tooltip>
              ) : (
                "Không xác định"
              )}
            </p>
            <div className="mt-16"></div>
            <div className="flex flex-row gap-2">
              <button
                className="flex-1 sm:flex-none px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors duration-200"
                onClick={() =>
                  router.push(`/manage/posts/update/${props.data._id}`)
                }
              >
                <i className="bi bi-pencil-square"></i>
              </button>
              <button
                className="flex-1 sm:flex-none px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                onClick={() => setIsOpenModalDelete(true)}
              >
                <i className="bi bi-trash"></i>
              </button>

              <Dropdown
                menu={{
                  items: [
                    ...(props.data.rank === 0
                      ? [
                          {
                            key: "pin",
                            label: (
                              <>
                                <span>
                                  Ghim bài viết
                                  <i className="bi bi-pin-angle ml-2"></i>
                                </span>
                              </>
                            ),
                            onClick: () => {
                              setIsOpenModalPin(true);
                            },
                          },
                        ]
                      : [
                          {
                            label: (
                              <>
                                <span className="text-red-500">
                                  Bỏ ghim bài viết
                                  <i className="bi bi-pin-angle ml-2"></i>
                                </span>
                              </>
                            ),
                            key: "unpin",
                            onClick: () => {
                              setIsOpenModalUnpin(true);
                            },
                          },
                        ]),
                    {
                      type: "divider",
                    },
                    {
                      label: (
                        <>
                          Sao chép liên kết
                          <i className="bi bi-link ml-2"></i>
                        </>
                      ),
                      key: "copy-link",
                      onClick: () => {
                        navigator.clipboard
                          .writeText(
                            `${window.location.origin}/${props.data.slug}`
                          )
                          .then(() => {
                            message.open({
                              type: "success",
                              content: "Đã sao chép liên kết vào clipboard",
                            });
                          })
                          .catch(() => {
                            message.open({
                              type: "error",
                              content: "Sao chép thất bại",
                            });
                          });
                      },
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <button className="flex-1 sm:flex-none px-3 py-1 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors duration-200">
                    <i className="bi bi-three-dots"></i>
                  </button>
                </a>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0"></div>
      </article>

      <ModalDeletePost
        isOpen={isOpenModalDelete}
        onClose={() => setIsOpenModalDelete(false)}
        _id={props.data._id}
        name={props.data.title}
        thumbnail={props.data.thumbnail}
        link={{
          image: props.data?.link?.image || [],
          video: props.data?.link?.video || [],
        }}
      />

      <ModalPinPost
        isOpen={isOpenModalPin}
        onClose={() => setIsOpenModalPin(false)}
        name={props.data.title}
        _id={props.data._id}
      />

      <ModalUnpinPost
        isOpen={isOpenModalUnpin}
        onClose={() => setIsOpenModalUnpin(false)}
        name={props.data.title}
        _id={props.data._id}
      />
    </>
  );
};

export default ItemPost;
