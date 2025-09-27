import { forwardRef, useImperativeHandle, Ref, useMemo, useState } from "react";
import { Select } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/Common";
import { getAllTags, getAllChildTagsBySlug } from "@/service/api/tag";

export type SelectTagRef = {
  getAllTag: () => [string, string] | [string] | [];
  clearAllTag: () => void;
  setSelectedTag: (value: string) => void;
  setSelectedChildTag: (value: string) => void;
};

type SelectTagProps = {
  arrow?: boolean;
};

const SelectTag = (props: SelectTagProps, ref: Ref<SelectTagRef>) => {
  const queryClient = useQueryClient();
  const [selectedTag, setSelectedTag] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "" });

  const [selectedChildTag, setSelectedChildTag] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "" });

  // console.log("selectedTag", selectedTag);
  // console.log("selectedChildTag", selectedChildTag);

  useImperativeHandle(ref, () => ({
    getAllTag: () => {
      if (!selectedTag.value) {
        return [];
      }
      if (!selectedChildTag.value) {
        return [selectedTag.value];
      }
      return [selectedTag.value, selectedChildTag.value];
    },
    clearAllTag: () => {
      setSelectedTag({ value: "", label: "" });
      setSelectedChildTag({ value: "", label: "" });
    },
    setSelectedTag: (value: string) => {
      setSelectedTag({
        ...selectedTag,
        value: value,
      });
    },
    setSelectedChildTag: (value: string) => {
      setSelectedChildTag({
        ...selectedChildTag,
        value: value,
      });
    },
  }));

  //----------------------------- Tag ----------------------------------

  const {
    data: data_tags,
    isLoading: isLoading_tags,
    isError: isError_tags,
    error: error_tags,
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

  const SelectOptionsTag = useMemo(() => {
    if (!data_tags?.data?.data) return [];
    return data_tags?.data?.data.map((tag) => ({
      value: tag.slug,
      label: tag.name,
    }));
  }, [data_tags]);

  const onChangeTag = (
    value: string,
    option: { value: string; label: string }
  ) => {
    setSelectedTag({
      value: option?.value,
      label: option?.label,
    });
    setSelectedChildTag({
      value: "",
      label: "",
    });
  };

  //----------------------------- Child Tag ----------------------------------

  const {
    data: data_childTags,
    isLoading: isLoading_childTags,
    isError: isError_childTags,
    error: error_childTags,
  } = useQuery({
    queryKey: [queryKeys.GET_All_CHILD_TAG_BY_SLUG, selectedTag.value],
    queryFn: () => getAllChildTagsBySlug(selectedTag.value),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    enabled: selectedTag.value !== "" ? true : false, //false: không chạy query
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  const SelectOptionsChildTag = useMemo(() => {
    if (!data_childTags?.data?.data) return [];
    return data_childTags?.data?.data.map((tag) => ({
      value: tag.slug,
      label: tag.name,
    }));
  }, [data_childTags]);

  const onChangeChildTag = (
    value: string,
    option: { value: string; label: string }
  ) => {
    if (value === "") {
      setSelectedChildTag({
        value: "",
        label: "",
      });
      return;
    }

    setSelectedChildTag({
      value: option?.value,
      label: option?.label,
    });
  };

  return (
    <>
      <div className="flex gap-4 items-center flex-row">
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Chọn chủ đề"
          optionFilterProp="label"
          notFoundContent={
            <>
              {isLoading_tags && (
                <p className="italic text-gray-500 text-center">
                  Đang tải dữ liệu...
                </p>
              )}
              {isError_tags && (
                <div className="flex justify-center">
                  <button
                    className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg"
                    onClick={() => {
                      queryClient.invalidateQueries({
                        queryKey: [queryKeys.GET_All_TAG],
                      }); //invalidate cache
                    }}
                  >
                    <i className="bi bi-exclamation-triangle"></i> Đã có lỗi xảy
                    ra, nhấn để thử lại
                  </button>
                </div>
              )}
            </>
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          onChange={(value, option) => {
            return onChangeTag(
              value,
              option as { value: string; label: string }
            );
          }}
          options={[
            { value: "", label: "❌ Bỏ chọn" },
            ...(SelectOptionsTag || []),
          ]}
          value={selectedTag.value || "Chọn chủ đề"}
        />
        {props.arrow && (
          <div>
            <i className="bi bi-arrow-right"></i>
          </div>
        )}
        <Select
          showSearch
          disabled={selectedTag.value === ""}
          style={{ width: 200 }}
          placeholder="Chọn chủ đề con"
          optionFilterProp="label"
          notFoundContent={
            <>
              {isLoading_childTags && (
                <p className="italic text-gray-500 text-center">
                  Đang tải dữ liệu...
                </p>
              )}
              {isError_childTags && (
                <div className="flex justify-center">
                  <button
                    className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg"
                    onClick={() => {
                      queryClient.invalidateQueries({
                        queryKey: [
                          queryKeys.GET_All_CHILD_TAG_BY_SLUG,
                          selectedTag.value,
                        ],
                      }); //invalidate cache
                    }}
                  >
                    <i className="bi bi-exclamation-triangle"></i> Đã có lỗi xảy
                    ra, nhấn để thử lại
                  </button>
                </div>
              )}
            </>
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          onChange={(value, option) => {
            return onChangeChildTag(
              value,
              option as { value: string; label: string }
            );
          }}
          options={[
            { value: "", label: "❌ Bỏ chọn" },
            ...(SelectOptionsChildTag || []),
          ]}
          value={selectedChildTag.value || "Chọn chủ đề con"}
        />
      </div>
    </>
  );
};

export default forwardRef(SelectTag);
