"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { message, Pagination, Button, Select, DatePicker } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import clsx from "clsx";

import { queryKeys, statusPost } from "@/constants/Common";
import ItemPost from "./item-post";
import SelectTag, { SelectTagRef } from "@/modules/tag/Select-Tag";

import { getAllPostRecent } from "@/service/api/post";
import {
  PAGE_POST_RECENT,
  LIMIT_POST_RECENT,
} from "@/app/manage/posts/view/constants";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;

const ListPost = () => {
  const queryClient = useQueryClient();
  const tagPostRef = useRef<SelectTagRef>(null);
  const titlePostRecentRef = useRef<HTMLHeadingElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  //----------------------
  const [selectedDate, setSelectedDate] = useState<
    [start: any | null | undefined, end: any | null | undefined]
  >([null, null]);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [selectedView, setSelectedView] = useState<
    "ASC" | "DESC" | "" | undefined
  >(undefined);
  const [selectedRank, setSelectedRank] = useState<
    "ASC" | "DESC" | "" | undefined
  >(undefined);

  //----------------------------

  const [filters, setFilters] = useState<{
    startDate?: string | undefined;
    endDate?: string | undefined;
    status?: string | undefined;
    author?: string | undefined;
    category?: string[] | undefined;
    view?: "ASC" | "DESC" | "" | undefined;
    rank?: "ASC" | "DESC" | "" | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
    status: undefined,
    author: undefined,
    category: undefined,
    view: undefined,
    rank: undefined,
  });

  const queryPage =
    searchParams.get("p") && !isNaN(Number(searchParams.get("p")))
      ? Number(searchParams.get("p"))
      : PAGE_POST_RECENT;
  const queryLimit =
    searchParams.get("l") && !isNaN(Number(searchParams.get("l")))
      ? Number(searchParams.get("l"))
      : LIMIT_POST_RECENT;

  const updateQuery = (newParams: { [key: string]: string | null }) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`, {
      scroll: false, // scroll to top
    });
  };

  const [_pagePostRecent, setPagePostRecent] = useState(queryPage);
  const [_limitPostRecent, setLimitPostRecent] = useState(queryLimit);

  // console.log("page_recent", _pagePostRecent);
  // console.log("page_recent", _limitPostRecent);

  const {
    data: data_post_recent,
    isLoading: isLoading_post_recent,
    isError: isError_post_recent,
    error: data_error_post_recent,
  } = useQuery({
    queryKey: [
      queryKeys.GET_ALL_POST_RECENT,
      _pagePostRecent,
      _limitPostRecent,
      filters,
    ],
    queryFn: () => getAllPostRecent(_pagePostRecent, _limitPostRecent, filters),
    gcTime: 1000 * 60 * 3, //thời gian xoá cache khi không sử dụng 3 phút
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  useEffect(() => {
    if (data_post_recent?.data?.data?.length === 0) {
      //ví dụ: limit 20 có 21 post xoá post thứ 21
      //console.log("dịch chuyển trang");
      setPagePostRecent(_pagePostRecent > 1 ? _pagePostRecent - 1 : 1);
      setLimitPostRecent(LIMIT_POST_RECENT);
      updateQuery({
        p: _pagePostRecent > 1 ? (_pagePostRecent - 1).toString() : "1",
        l: LIMIT_POST_RECENT.toString(),
      });
    }
  }, [data_post_recent]);

  // console.log("data_response", data_response);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    //nếu selectedDate[0] có giá trị thì không cho chọn ngày trước nó
    if (selectedDate[0]) {
      return (
        current &&
        (current < dayjs(selectedDate[0]) || current > dayjs().endOf("day"))
      );
    }
    if (selectedDate[1]) {
      return (
        current &&
        (current > dayjs(selectedDate[1]) || current > dayjs().endOf("day"))
      );
    }
    //nếu không có selectedDate[0] và selectedDate[1] thì không cho chọn ngày của tương lai
    return current && current > dayjs().endOf("day");
  };

  const handleSearch = () => {
    let category = tagPostRef.current?.getAllTag() || [];
    setPagePostRecent(1);
    setLimitPostRecent(_limitPostRecent);
    updateQuery({
      p: "1",
      l: _limitPostRecent.toString(),
    });
    scrollTo(titlePostRecentRef);
    setFilters({
      ...filters,
      startDate: selectedDate[0] ? selectedDate[0]?.toISOString() : undefined,
      endDate: selectedDate[1] ? selectedDate[1]?.toISOString() : undefined,
      status: selectedStatus ? selectedStatus : undefined,
      view: selectedView ? selectedView : undefined,
      rank: selectedRank ? selectedRank : undefined,
      category: category,
    });
  };

  const scrollTo = (element: React.RefObject<HTMLElement>) => {
    element.current?.scrollIntoView({});
  };

  const onChangeSelectStatus = (value: string) => {
    setSelectedStatus(value);
  };

  const onChangeSelectView = (value: "ASC" | "DESC" | "" | undefined) => {
    setSelectedView(value);
  };

  const onChangeSelectRank = (value: "ASC" | "DESC" | "" | undefined) => {
    setSelectedRank(value);
  };

  const invalidateQueriesPost = () => {
    queryClient.invalidateQueries({
      queryKey: [
        queryKeys.GET_ALL_POST_RECENT,
        _pagePostRecent,
        _limitPostRecent,
        filters,
      ],
    });
  };

  return (
    <>
      <h1
        className={clsx(
          "text-2xl font-semibold mb-4"
          //    {
          //   "text-gray-900": theme === Theme.LIGHT_MODE,
          //   "text-gray-100": theme === Theme.DARK_MODE,
          // }
        )}
        ref={titlePostRecentRef}
      >
        Danh sách bài viết
      </h1>

            {/* .custom-scrollbar-sidebar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar-sidebar::-webkit-scrollbar-track {
          background: #f3f4f6;
        }

        .custom-scrollbar-sidebar::-webkit-scrollbar-thumb {
          background-color: #d4d4d4;
          border-radius: 20px;
        }

       
        .dark .custom-scrollbar-sidebar::-webkit-scrollbar-track {
          background: #18181b;
        }

        .dark .custom-scrollbar-sidebar::-webkit-scrollbar-thumb {
          background-color: #4b5563;
        }

        
        .custom-scrollbar-sidebar {
          scrollbar-width: thin;
          scrollbar-color: #d4d4d4 #f3f4f6;
        }

        .dark .custom-scrollbar-sidebar {
          scrollbar-color: #4b5563 #18181b;
        } */}
      <style jsx>
        {`
       
  
      `}
      </style>

      <div
        className={clsx(
          "custom-scrollbar-sidebar overflow-x-auto whitespace-nowrap py-4"
        )}
      >
        <div className="flex gap-4 px-4 w-max">
          {/* {[
            "Box 1",
            "Box 2",
            "Box 3",
            "Box 4",
            "Box 5",
            "Box 6",
            "Box 7",
            "Box 8",
          ].map((item: any, index: number) => (
            <div
              key={index}
              className="min-w-[150px] h-24 bg-blue-500 text-white flex items-center justify-center rounded-lg shadow-md"
            >
              {item}
            </div>
          ))} */}
          <SelectTag ref={tagPostRef} />
          {/* <span className="text-sm text-gray-500">Thời gian:</span> */}

          <RangePicker
            style={{
              //backgroundColor: theme === Theme.LIGHT_MODE ? "#fff" : "#1f2937",
              //chỉnh màu chữ
              height: "33px",
            }}
            format="DD-MM-YYYY" //giờ GMT+7 00:00:00 -> GMT+0 17:00:00
            // format="YYYY-MM-DD HH:mm:ss"
            lang="vi"
            placeholder={["ngày trở về sau", "ngày trở về trước"]}
            onCalendarChange={(dates: any, dateStrings, info) => {
              // console.log(
              //   "Selected Time: ",
              //   dates[0]?.toISOString(),
              //   dateStrings
              // );
              //dateStrings ['01-12-2024', '23-04-2025']
              setSelectedDate(dates);
            }}
            disabledDate={disabledDate}
            value={selectedDate}
          />

          <Select
            showSearch
            style={{ width: 100 }}
            placeholder="Trạng thái"
            optionFilterProp="label"
            onChange={onChangeSelectStatus}
            options={[
              { value: statusPost.PUBLIC, label: "Công khai" },
              { value: statusPost.SHARED, label: "Chia sẻ" },
              { value: statusPost.PRIVATE, label: "Riêng tư" },
              { value: "", label: "Tất cả" },
            ]}
            defaultValue={""}
          />
          <Select
            showSearch
            style={{ width: 120 }}
            placeholder="Lượt xem"
            optionFilterProp="label"
            onChange={onChangeSelectView}
            options={[
              { value: "ASC", label: "Lượt xem ⬆️" }, // tăng dần lượt xem
              { value: "DESC", label: "Lượt xem ⬇️" }, // giảm dần lượt xem
              { value: "", label: "Mặc định" },
            ]}
            defaultValue={""}
          />
          <Select
            showSearch
            style={{ width: 120 }}
            placeholder="Xếp hạng"
            optionFilterProp="label"
            onChange={onChangeSelectRank}
            options={[
              { value: "ASC", label: "Xếp hạng ⬆️" }, // tăng dần lượt xem
              { value: "DESC", label: "Xếp hạng ⬇️" }, // giảm dần lượt xem
              { value: "", label: "Mặc định" },
            ]}
            defaultValue={""}
          />
          <Button
            title="Tải lại"
            type="default"
            onClick={() => {
              invalidateQueriesPost();
            }}
            className="px-3 py-2 bg-slate-400 rounded-md hover:bg-slate-500"
          >
            <i className="bi bi-arrow-clockwise"></i> Tải lại
          </Button>
          {/* <Segmented
        options={[
          { value: "List", icon: <BarsOutlined /> },
          { value: "Kanban", icon: <AppstoreOutlined /> },
        ]}
        value={segmented}
        onChange={(value) => {
          setSegmented(value as "List" | "Kanban");
        }}
          /> */}
          <button
            className="p-1.5 bg-slate-400 rounded-md hover:bg-blue-600 w-16 sm:w-auto"
            onClick={handleSearch}
            style={{
              height: "30px",
            }}
          >
            <i className="bi bi-search text-white" />
          </button>
        </div>
      </div>

      {/* ------------------------- Bài viết gần đây ----------------------------- */}
      <div
        className={clsx(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4"
          // {
          //   "bg-slate-50": theme === Theme.LIGHT_MODE,
          //   "bg-zinc-900": theme === Theme.DARK_MODE,
          // }
        )}
      >
        {(data_post_recent?.data?.data ?? []).length > 0 &&
          data_post_recent?.data?.data?.map((post) => {
            return (
              <ItemPost
                key={post._id}
                data={post}
              />
            );
          })}
        {!isLoading_post_recent &&
          !isError_post_recent &&
          (data_post_recent?.data?.data ?? []).length === 0 && (
            <div
              className={clsx(
                "col-span-full flex justify-center items-center h-36rounded-lg text-center  text-gray-500",
                "bg-slate-50 dark:bg-zinc-900"
              )}
            >
              Không có bài viết nào
            </div>
          )}
        {isLoading_post_recent && (
          <div
            className={clsx(
              "col-span-full flex justify-center items-center h-36 rounded-lg",
              "bg-slate-50 dark:bg-zinc-900"
            )}
          >
            <div className="text-center text-gray-500">Đang tải...</div>
          </div>
        )}
        {isError_post_recent && (
          <div
            className={clsx(
              "col-span-full flex justify-center items-center h-36 rounded-lg",
              "bg-red-50 dark:bg-red-900"
            )}
          >
            <div className="text-center text-red-500">
              <button
                className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg"
                onClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: [
                      queryKeys.GET_ALL_POST_RECENT,
                      _pagePostRecent,
                      _limitPostRecent,
                    ],
                  }); //invalidate cache
                }}
              >
                <i className="bi bi-exclamation-triangle"></i> Đã có lỗi xảy ra,
                nhấn để thử lại
              </button>
            </div>
          </div>
        )}
      </div>
      <Pagination
        style={{
          marginTop: "40px",
          display:
            data_post_recent && data_post_recent?.data?.data?.length > 0
              ? "block"
              : "none",
        }}
        onChange={(page: number, pageSize: number) => {
          // console.log("page", page);
          // console.log("pageSize", pageSize);
          setPagePostRecent(page);
          setLimitPostRecent(pageSize);
          updateQuery({
            p: page.toString(),
            l: pageSize.toString(),
          });
          scrollTo(titlePostRecentRef);
        }}
        showSizeChanger={false}
        showQuickJumper={false}
        defaultPageSize={Number(_limitPostRecent)}
        defaultCurrent={Number(_pagePostRecent)}
        current={Number(_pagePostRecent)}
        total={data_post_recent?.data?.totalPosts}
      />
    </>
  );
};

export default ListPost;
