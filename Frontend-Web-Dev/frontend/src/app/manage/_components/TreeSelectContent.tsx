"use client";

import React, { useState, useEffect, useMemo } from "react";
import { TreeSelect, message, Button } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys, tagNext } from "@/constants/Common";
import { getAllTagHeader } from "@/service/api/tag";
import type { TagHeader } from "@/service/api/tag/types";

import { updateDataWeb,readDataWeb } from "@/service/api/web";
import { revalidateTag } from "@/service/api/web/actions";

const { SHOW_PARENT } = TreeSelect;

const TreeSelectContent = (props: any) => {
  const queryClient = useQueryClient();
  const [keySelect, setKeySelect] = useState<string[] | undefined>(undefined);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
  const [isLoadingKeySelect, setIsLoadingKeySelect] = useState<boolean>(false);
  // const [sortTreeData, setSortTreeData] = useState<any>([]);
  // console.log("keySelect: ", keySelect);
  const {
    data: dataTagHeader,
    isLoading: isLoadingTagHeader,
    isError: isErrorTagHeader,
    error,
  } = useQuery({
    queryKey: [queryKeys.GET_ALL_TAG_HEADER],
    queryFn: () => getAllTagHeader(),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  const getKeySelect = async () => {
    setIsLoadingKeySelect(true);

    const response = await readDataWeb();
    if (response?.status === 200) {
      setKeySelect(response?.data?.data?.select_content || undefined);
    }
    setIsLoadingKeySelect(false);

    return response;
  };

  const convertCategories = (categories: TagHeader[]) => {
    return categories.map((category: TagHeader) => {
      const menuItem: {
        title: string;
        value: string;
        children?: any;
      } = {
        title: category.name,
        value: `${category.slug}`,
      };

      if (category.child && category.child.length > 0) {
        menuItem.children = convertCategories(category.child);
      }

      return menuItem;
    });
  };

  const treeData = useMemo(() => {
    if (dataTagHeader?.data?.data && dataTagHeader?.data?.data.length > 0) {
      const data = dataTagHeader?.data?.data;
      // console.log("data: ", data);
      return convertCategories(data);
    }
  }, [dataTagHeader]);

  //console.log("treeData: ", treeData);

  const filterTreeData = (treeData: any, values: any) => {
    if (!values) {
      return treeData;
    }
    const filterNodes = (nodes: any) => {
      let filtered = [];

      for (let node of nodes) {
        let filteredChildren: any = node.children
          ? filterNodes(node.children)
          : [];

        if (values.includes(node.value)) {
          // Nếu có đúng một children thì giữ luôn nó
          let newNode = { ...node };
          if (filteredChildren.length === 1) {
            newNode.children = filteredChildren; // add children
          } else if (filteredChildren.length > 1) {
            newNode.children = filteredChildren; // add children
          }
          filtered.push(newNode);
        } else if (filteredChildren.length > 0) {
          // Nếu có con hợp lệ thì giữ lại node cha
          filtered.push({ ...node, children: filteredChildren });
        }
      }

      // Sắp xếp lại theo thứ tự trong values
      filtered.sort(
        (a, b) => values.indexOf(a.value) - values.indexOf(b.value)
      );

      return filtered;
    };

    return filterNodes(treeData);
  };

  const updateData = async (newValue: any) => {
    // console.log("newValue: ", newValue);
    if (!keySelect) {
      return message.open({
        type: "warning",
        content: "Vui lòng chọn danh mục",
      });
    }
    setIsLoadingUpdate(true);
    //gọi qua server ko throw chi tiết error
    const response = await updateDataWeb({
      content: newValue,
      select_content: keySelect,
    }).catch((error) => {
      //console.log("___error: ", error);
      setIsLoadingUpdate(false);
      message.open({
        type: "error",
        content: "Cập nhật thất bại",
      });
    });
    //console.log("___response: ", response);
    if (response?.status === 200) {
      const res = await revalidateTag(tagNext.WEB).catch((error) => {
        setIsLoadingUpdate(false);
        message.open({
          type: "error",
          content: "Cập nhật thất bại",
        });
      });
      //console.log("___res: ", res);
      if (res?.status === 200) {
        setIsLoadingUpdate(false);
        setKeySelect(undefined);
        message.open({
          type: "success",
          content: "Cập nhật thành công",
        });
      }
    }
  };

  // useEffect(() => {
  //   //console.log("___keySelect: ", keySelect);
  //   const sortedTreeData = filterTreeData(treeData, keySelect);
  //   if (!sortedTreeData) return;
  //   // console.log("___sortedTreeData: ", sortedTreeData.reverse());
  //   //setSortTreeData(sortedTreeData.reverse());
  // }, [keySelect]);

  const onChange = (newValue: string[]) => {
    setKeySelect(newValue);
  };
  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        <TreeSelect
          className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
          notFoundContent={
            <>
              {isLoadingTagHeader && (
                <p className="italic text-gray-500 text-center">
                  Đang tải dữ liệu...
                </p>
              )}

              {isErrorTagHeader && (
                <>
                  <div className="flex justify-center">
                    <button
                      className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg"
                      onClick={() => {
                        queryClient.invalidateQueries({
                          queryKey: [queryKeys.GET_ALL_TAG_HEADER],
                        }); //invalidate cache
                      }}
                    >
                      <i className="bi bi-exclamation-triangle"></i> Đã có lỗi
                      xảy ra, nhấn để thử lại
                    </button>
                  </div>
                </>
              )}
            </>
          }
          treeData={treeData}
          value={keySelect}
          onChange={onChange}
          treeCheckable={true}
          showCheckedStrategy={SHOW_PARENT}
          placeholder="Chọn danh mục"
        />
        <Button
          type="primary"
          loading={isLoadingUpdate}
          onClick={() => updateData(filterTreeData(treeData, keySelect) || [])}
          disabled={!keySelect || keySelect.length === 0}
        >
          {isLoadingUpdate ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
        <Button
          type="default"
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: [queryKeys.GET_ALL_TAG_HEADER],
            }); //invalidate cache
          }}
          className="ml-2"
        >
          <i className="bi bi-arrow-clockwise"></i> Tải lại
        </Button>
        <Button
          type="default"
          onClick={() => getKeySelect()}
          className="ml-2"
          loading={isLoadingKeySelect}
        >
          <i className="bi bi-cloud-download"></i>
          {isLoadingKeySelect ? "Đang tải..." : "Lấy dữ liệu"}
        </Button>
        <Button
          type="default"
          onClick={() => {
            setKeySelect(undefined);
          }}
          className="ml-2"
          disabled={!keySelect || keySelect.length === 0}
        >
          <i className="bi bi-x-circle"></i>
        </Button>
      </div>
    </>
  );
};

export default TreeSelectContent;
