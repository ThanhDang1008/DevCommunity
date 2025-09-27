"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import clsx from "clsx";
import { HardDrive, FileType, AlertCircle, CheckCircle2 } from "lucide-react";

import { getFileStatisticsByAuthor } from "@/service/api/file";
import { queryKeys } from "@/constants/Common";
import { convertByte } from "@/shared/utils/convertByte";
import { useGetInfoUser } from "@/modules/user/hooks";
import { PermissionType } from "@/service/api/user/types";

// Định nghĩa kiểu dữ liệu
interface FileDetail {
  mimetype: string;
  totalSize: number;
  totalSizeDescription: string;
  count: number;
}

interface FileStatistics {
  totalSize: number;
  totalSizeDescription: string;
  count: number;
  detail: FileDetail[];
}

// Chuyển đổi mimetype thành tên hiển thị dễ đọc hơn
const getMimetypeDisplayName = (mimetype: string): string => {
  const mapping: Record<string, string> = {
    "application/pdf": "PDF",
    "image/png": "PNG",
    "image/jpeg": "JPEG",
    "image/webp": "WebP",
    "text/plain": "Text",
    "application/msword": "Word",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "Word",
    "application/vnd.ms-excel": "Excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "Excel",
    "application/zip": "ZIP",
    "video/mp4": "MP4",
    "audio/mpeg": "MP3",
  };

  return mapping[mimetype] || mimetype.split("/")[1] || mimetype;
};

// Màu sắc cho biểu đồ
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
];

// Component chính
const FileStatistics = () => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useGetInfoUser();

  const {
    data: dataFileStatistics,
    isLoading: isLoadingFileStatistics,
    isError: isErrorFileStatistics,
    error: errorFile,
  } = useQuery({
    queryKey: [queryKeys.GET_FILE_STATISTIC],
    queryFn: () => getFileStatisticsByAuthor(),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  //console.log("dataFileStatistics", dataFileStatistics);

  // Chuyển đổi dữ liệu cho biểu đồ
  const getPieChartData = () => {
    if (!dataFileStatistics?.data?.data?.detail) return [];

    return dataFileStatistics.data.data.detail.map((item) => ({
      name: getMimetypeDisplayName(item.mimetype),
      value: item.totalSize,
      count: item.count,
      description: item.totalSizeDescription,
    }));
  };

  //console.log("getPieChartData", getPieChartData());

  // Format percentage
  const getPercentage = (size: number) => {
    if (!dataFileStatistics?.data?.data?.totalSize) return "0%";
    return `${((size / dataFileStatistics?.data?.data.totalSize) * 100).toFixed(
      1
    )}%`;
  };

  // Component hiển thị tooltip khi hover trên biểu đồ
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={clsx(
            "shadow-md rounded-md p-3 border ",
            "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          )}
        >
          <p className="font-semibold">{data.name}</p>
          <p className="text-gray-400">Số lượng: {data.count} file</p>
          <p className="text-gray-400">Kích thước: {data.description}</p>
          <p className="text-gray-400">Tỷ lệ: {getPercentage(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoadingFileStatistics) {
    return (
      <div
        className={clsx(
          "flex items-center justify-center h-64 w-full  rounded-lg",
          "bg-gray-50 dark:bg-gray-800"
        )}
      >
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (isErrorFileStatistics) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-red-50 rounded-lg">
        <div className="text-center text-red-600">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() =>
              queryClient.refetchQueries({
                queryKey: [queryKeys.GET_FILE_STATISTIC],
              })
            }
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  //   if (!dataFileStatistics || dataFileStatistics?.data?.data.count === 0) {
  //     return (
  //       <div className="flex items-center justify-center h-64 w-full bg-gray-50 rounded-lg">
  //         <div className="text-center text-gray-600">
  //           <FileType className="h-8 w-8 mx-auto mb-2" />
  //           <p>Không có dữ liệu thống kê</p>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className={clsx("rounded-lg", "bg-white dark:bg-zinc-900")}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Thống kê</h2>
        <div
          className={clsx(
            "flex items-center  px-3 py-1 rounded-full",
            "bg-green-50 dark:bg-green-900"
          )}
        >
          <CheckCircle2
            className={clsx(
              "h-4 w-4 mr-1",
              "text-green-600 dark:text-green-400"
            )}
          />
          <span
            className={clsx("text-sm ", "text-gray-600 dark:text-green-400")}
          >
            {dataFileStatistics?.data?.data.count} tệp tin
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ tròn */}
        <div
          className={clsx(
            "lg:col-span-2 rounded-lg p-4 h-80",
            "bg-white dark:bg-zinc-900"
          )}
        >
          {dataFileStatistics?.data?.data.count === 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <div className="flex items-center justify-center h-full">
                <p
                  className={clsx(
                    "text-sm",
                    "text-gray-500 dark:text-gray-400"
                  )}
                >
                  Không có dữ liệu thống kê
                </p>
              </div>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getPieChartData()}
                  cx="50%"
                  cy="46%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                >
                  {getPieChartData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Thông tin tổng quan */}
        <div className="flex flex-col justify-between">
          <div
            className={clsx(
              "rounded-lg p-4 mb-4",
              "bg-blue-50 dark:bg-blue-900" // Màu nền cho tổng dung lượng
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className={clsx(
                  "font-medium",
                  "text-gray-700 dark:text-gray-200" // Màu chữ cho tiêu đề
                )}
              >
                Tổng dung lượng
              </h3>
              <HardDrive
                className={clsx(
                  "h-5 w-5 ",
                  "text-blue-600 dark:text-blue-400" // Màu biểu tượng
                )}
              />
            </div>
            <p
              className={clsx(
                "text-2xl font-bold ",
                "text-blue-700 dark:text-blue-300"
              )}
            >
              {dataFileStatistics?.data?.data.totalSizeDescription}/
              {convertByte(
                Number(
                  userInfo?.permissions?.find(
                    (permission) =>
                      permission.name === PermissionType.UPLOAD_FILE
                  )?.limit
                )
              )}
            </p>
          </div>

          {/* Danh sách chi tiết */}
          <div
            className={clsx(
              "rounded-lg p-4 flex-1 overflow-auto",
              "bg-gray-100 dark:bg-gray-800" // Màu nền cho danh sách chi tiết
            )}
          >
            <h3
              className={clsx(
                "font-medium mb-3",
                "text-gray-700 dark:text-gray-200"
              )}
            >
              Chi tiết theo loại tệp
            </h3>
            <div className="space-y-3 max-h-32 overflow-y-auto pr-1">
              {dataFileStatistics?.data?.data?.detail &&
                dataFileStatistics?.data?.data?.detail.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div
                        className="h-3 w-3 rounded-full mr-2"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <span
                        className={clsx(
                          "text-sm ",
                          "text-gray-700 dark:text-gray-200"
                        )}
                      >
                        {getMimetypeDisplayName(item.mimetype)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className={clsx(
                          "text-sm font-medium ",
                          "text-gray-900 dark:text-gray-300"
                        )}
                      >
                        {item.count} tệp
                      </div>
                      <div
                        className={clsx(
                          "text-xs ",
                          "text-gray-500 dark:text-gray-400"
                        )}
                      >
                        {item.totalSizeDescription} (
                        {getPercentage(item.totalSize)})
                      </div>
                    </div>
                  </div>
                ))}
              {dataFileStatistics?.data?.data?.detail.length === 0 && (
                <div className="flex items-center justify-center h-32">
                  <p
                    className={clsx(
                      "text-sm",
                      "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    Không có dữ liệu thống kê
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Phần bảng chi tiết */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">Bảng thống kê chi tiết</h3>
        <div className="overflow-x-auto">
          <table className={clsx("min-w-full ", "bg-white dark:bg-gray-800")}>
            <thead className={clsx("bg-gray-50 dark:bg-gray-900")}>
              <tr>
                <th className="py-2 px-4 border-b text-left text-xs font-medium uppercase tracking-wider">
                  Loại tệp
                </th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium uppercase tracking-wider">
                  Dung lượng
                </th>
                <th className="py-2 px-4 border-b text-left text-xs font-medium uppercase tracking-wider">
                  Tỷ lệ
                </th>
              </tr>
            </thead>
            <tbody
              className={clsx(
                "divide-y ",
                "divide-gray-200 dark:divide-gray-700"
              )}
            >
              {dataFileStatistics?.data?.data?.detail &&
                dataFileStatistics?.data?.data?.detail.map((item, index) => (
                  <tr
                    key={index}
                    //className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    className={clsx("bg-white dark:bg-gray-800")}
                  >
                    <td className="py-2 px-4 text-sm">
                      <div className="flex items-center">
                        <div
                          className="h-3 w-3 rounded-full mr-2"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        {getMimetypeDisplayName(item.mimetype)}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-400">
                      {item.count} tệp
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-400">
                      {item.totalSizeDescription}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-400">
                      {getPercentage(item.totalSize)}
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot className={clsx("bg-gray-100 dark:bg-gray-900")}>
              <tr>
                <td className="py-2 px-4 text-sm font-medium">Tổng cộng</td>
                <td className="py-2 px-4 text-sm font-medium ">
                  {dataFileStatistics?.data?.data.count} tệp
                </td>
                <td className="py-2 px-4 text-sm font-medium ">
                  {dataFileStatistics?.data?.data.totalSizeDescription}
                </td>
                <td className="py-2 px-4 text-sm font-medium ">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FileStatistics;
