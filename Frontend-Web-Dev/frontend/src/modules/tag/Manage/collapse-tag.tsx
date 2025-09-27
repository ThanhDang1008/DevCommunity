"use client";

import { Collapse, Button } from "antd";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import CollapseChildTag from "./collapse-child-tag";
import ModalCreateTag from "./ModalCreateTag";
import { getAllTags } from "@/service/api/tag";
import { queryKeys } from "@/constants/Common";

const CollapseTag = () => {
  const queryClient = useQueryClient();

  const [isOpenModalCreateTag, setIsOpenModalCreateTag] =
    useState<boolean>(false);

  const {
    data: data_response,
    isLoading,
    isError,
    error: error_semesters,
  } = useQuery({
    queryKey: [queryKeys.GET_All_TAG],
    queryFn: () => getAllTags(),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  const data_tags = useMemo(() => {
    if (data_response) {
      return data_response.data.data.map((tag) => {
        return {
          key: tag._id,
          label: tag.name,
          children: (
            <CollapseChildTag
              tag_id={tag._id}
              name={tag.name}
              description={tag.description || ""}
              slug={tag.slug}
            />
          ),
        };
      });
    }
    return [];
  }, [data_response]);

  //  console.log("error_semesters", error_semesters);

  // console.log("data_semesters", data_semesters);
  return (
    <>
      <div className="flex sm:flex-row justify-between flex-col gap-2">
        <div>
          <h3 className="text-lg font-semibold">Danh sách chủ đề</h3>
        </div>
        <button
          type="button"
          //tailwindcss
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mb-2"
          onClick={() => {
            setIsOpenModalCreateTag(true);
          }}
        >
          Thêm
        </button>
      </div>
      {data_tags && data_tags.length > 0 && <Collapse items={data_tags} />}
      {isLoading && <p>Đang tải...</p>}
      {!isLoading && !isError && data_tags?.length === 0 && (
        <p
          style={{
            textAlign: "center",
          }}
        >
          Chưa có chủ đề nào được tạo
        </p>
      )}
      {isError && (
        <>
          <div
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
            }}
          >
            <Button
              className="mx-2 my-2"
              color="danger"
              danger
              onClick={() => {
                queryClient.invalidateQueries({
                  queryKey: [queryKeys.GET_All_TAG],
                });
              }}
            >
              <i className="bi bi-exclamation-triangle"></i> Đã xảy ra lỗi. Nhấn
              để thử lại
            </Button>
          </div>
        </>
      )}

      <ModalCreateTag
        isOpen={isOpenModalCreateTag}
        onClose={() => {
          setIsOpenModalCreateTag(false);
        }}
      />
    </>
  );
};

export default CollapseTag;
