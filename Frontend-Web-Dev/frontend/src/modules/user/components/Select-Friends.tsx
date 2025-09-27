"use client";

import type { SelectProps } from "antd";
import { Select } from "antd";
import {
  forwardRef,
  useImperativeHandle,
  Ref,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";

import { getListFriends } from "@/service/api/user";

export type SelectFriendsRef = {};

type SelectFriendsProps = {
  onChange?: (value: { value: string; label: string }[] | []) => void;
  onClear?: () => void;
};

const SelectFriends = (
  props: SelectFriendsProps,
  ref: Ref<SelectFriendsRef>
) => {
  const queryClient = useQueryClient();
  const [selectedFriends, setSelectedFriends] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const MAX_COUNT = 999;

  //console.log("selectedFriends", selectedFriends);
  useEffect(() => {
    if (props.onChange) {
      props.onChange(selectedFriends);
    }
  }, [selectedFriends]);

  const {
    data: listFriends,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.GET_LIST_FRIEND],
    queryFn: () => getListFriends(),
    gcTime: 1000 * 60 * 10, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  const options = useMemo(() => {
    if (
      listFriends &&
      listFriends?.data?.data?.listFriendId &&
      listFriends?.data?.data?.listFriendId.length > 0
    ) {
      return listFriends?.data?.data?.listFriendId.map((friend) => ({
        value: friend._id,
        label: `${friend.fullname} (${friend.email})`,
      }));
    }
    return [];
  }, [listFriends]);

  useImperativeHandle(ref, () => ({}));

  const handleChange = (
    value: {
      value: string;
      label: string;
    }[],
    option:
      | {
          value: string;
          label: string;
        }
      | {
          value: string;
          label: string;
        }[]
      | undefined
  ) => {
    if (Array.isArray(option)) {
      setSelectedFriends(option);
    } else if (option) {
      setSelectedFriends([option]);
    } else {
      setSelectedFriends([]);
    }
  };

  //console.log("options", options);

  return (
    <>
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="Chọn bạn bè"
        notFoundContent={
          <>
            {isLoading && (
              <p className="italic text-gray-500 dark:text-gray-400 text-center">
                Đang tải dữ liệu...
              </p>
            )}
            {isError && (
              <div className="flex flex-col items-center gap-2">
                <button
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 px-4 py-2 rounded-lg"
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: [queryKeys.GET_LIST_FRIEND],
                    }); //invalidate cache
                  }}
                >
                  <i className="bi bi-exclamation-triangle"></i> Đã có lỗi xảy
                  ra, nhấn để thử lại
                </button>
                <button
                  className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 px-3 py-1 rounded-lg text-sm"
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: [queryKeys.GET_LIST_FRIEND],
                    });
                  }}
                >
                  <i className="bi bi-arrow-clockwise"></i> Tải lại
                </button>
              </div>
            )}
            {options.length === 0 && !isLoading && (
              <div className="flex flex-col items-center gap-2">
                <p className="italic text-gray-500 dark:text-gray-400 text-center">
                  Không có bạn bè nào để chọn
                </p>
                <button
                  className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 px-3 py-1 rounded-lg text-sm"
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: [queryKeys.GET_LIST_FRIEND],
                    });
                  }}
                >
                  <i className="bi bi-arrow-clockwise"></i> Tải lại
                </button>
              </div>
            )}
          </>
        }
        showSearch
        value={selectedFriends}
        onChange={(value, option) => {
          return handleChange(value, option);
        }}
        suffixIcon={
          <>
            <span>
              {selectedFriends.length} / {MAX_COUNT}
            </span>
          </>
        } // Tùy chỉnh biểu tượng thả xuống nếu cần
        maxCount={MAX_COUNT} // Giới hạn số lượng thẻ có thể chọn
        maxTagCount={10} // Giới hạn số lượng thẻ hiển thị
        maxTagTextLength={20} // Giới hạn độ dài của văn bản thẻ tối đa
        maxTagPlaceholder={(omittedValues) => {
          return `+${omittedValues.length} bạn bè khác`;
        }}
        options={options}
      />
    </>
  );
};

export default forwardRef(SelectFriends);
