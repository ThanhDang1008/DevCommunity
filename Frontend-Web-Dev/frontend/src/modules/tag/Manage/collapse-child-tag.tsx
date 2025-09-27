import { Collapse, Button } from "antd";
import { useState, useMemo, memo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import ModalCreateChildTag from "./ModalCreateChildTag";
import ModalDeleteTag from "./ModalDeleteTag";
import ModalUpdateTag from "./ModalUpdateTag";
import ChildTag from "./ChildTag";
import { getAllChildTags } from "@/service/api/tag";
import { queryKeys } from "@/constants/Common";

type CollapseChildTagProps = {
  tag_id: string;
  name: string;
  description: string;
  slug: string;
};

const CollapseChildTag = (props: CollapseChildTagProps) => {
  const queryClient = useQueryClient();
  const [isOpenModalCreateChildTag, setIsOpenModalCreateChildTag] =
    useState<boolean>(false);
  const [isOpenModalUpdateTag, setIsOpenModalUpdateTag] =
    useState<boolean>(false);
  const [isOpenModalDeleteTag, setIsOpenModalDeleteTag] =
    useState<boolean>(false);

  const {
    data: data_response,
    isLoading,
    isError,
    error: error_child_tag,
  } = useQuery({
    queryKey: [queryKeys.GET_All_CHILD_TAG, props.tag_id],
    queryFn: () => getAllChildTags(props.tag_id),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    //enabled:
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  const data_child_tag = useMemo(() => {
    if (data_response) {
      return data_response.data.data.map((tag) => {
        return {
          key: tag._id,
          label: tag.name,
          children: (
            <ChildTag
              tag_id={props.tag_id}
              child_tag_id={tag._id}
              slug={props.slug}
              child_slug={tag.slug}
              name={tag.name}
              description={tag.description || ""}
            />
          ),
        };
      });
    }
    return [];
  }, [data_response, props.tag_id]);

  // console.log("data_majors", data_majors);

  return (
    <>
      <div>
        <p className="font-semibold">Mô tả:</p>
        {props.description ? (
          <p>{props.description}</p>
        ) : (
          <p>(chưa có mô tả)</p>
        )}
      </div>
      <div className="flex sm:flex-row justify-between flex-col gap-2">
        <div>
          <h3 className="text-lg font-semibold">
            Danh sách chủ đề thuộc{" "}
            <span className="text-blue-500">{props.name.toLowerCase()}</span>
          </h3>
        </div>
        <button
          type="button"
          //tailwindcss
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mb-2"
          onClick={() => {
            setIsOpenModalCreateChildTag(true);
          }}
        >
          Thêm
        </button>
      </div>
      {data_child_tag && data_child_tag.length > 0 && (
        <>
          <Collapse
            expandIcon={({ isActive }) => (
              <i
                className={`bi ${
                  isActive ? "bi-folder2-open" : "bi-folder-fill"
                }`}
              ></i>
            )}
            size="small"
            items={data_child_tag}
          />
        </>
      )}
      {isLoading && <p>Đang tải...</p>}
      {!isLoading && !isError && data_child_tag?.length === 0 && (
        <p
          style={{
            textAlign: "center",
          }}
        >
          Chưa có chủ đề nào được thêm vào
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
                  queryKey: [queryKeys.GET_All_CHILD_TAG, props.tag_id],
                });
              }}
            >
              <i className="bi bi-exclamation-triangle"></i> Đã xảy ra lỗi, nhấn
              để thử lại
            </Button>
          </div>
        </>
      )}
      <div className="flex sm:flex-row gap-2 flex-col mt-2">
        <button
          type="button"
          //tailwindcss
          className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 py-2 px-4 rounded"
          onClick={() => {
            setIsOpenModalUpdateTag(true);
          }}
        >
           <i className="bi bi-pencil-square"></i>
        </button>
        <button
          type="button"
          //tailwindcss
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          onClick={() => {
            setIsOpenModalDeleteTag(true);
          }}
        >
            <i className="bi bi-trash"></i>
        </button>
      </div>

      <ModalCreateChildTag
        isOpen={isOpenModalCreateChildTag}
        onClose={() => {
          setIsOpenModalCreateChildTag(false);
        }}
        tag_id={props.tag_id}
        name={props.name}
      />
      {isOpenModalUpdateTag && (
        <ModalUpdateTag
          isOpen={isOpenModalUpdateTag}
          onClose={() => {
            setIsOpenModalUpdateTag(false);
          }}
          tag_id={props.tag_id}
          name={props.name}
        />
      )}
      <ModalDeleteTag
        isOpen={isOpenModalDeleteTag}
        onClose={() => {
          setIsOpenModalDeleteTag(false);
        }}
        tag_id={props.tag_id}
        name={props.name}
        slug={props.slug}
      />
    </>
  );
};

export default memo(CollapseChildTag);
