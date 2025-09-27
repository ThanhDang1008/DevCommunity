"use client";

import { useState, useRef, useEffect } from "react";
import {
  Modal,
  Tooltip,
  Button,
  Dropdown,
  Select,
  DatePicker,
  Image as ImageAntd,
  message,
  Pagination,
  Segmented,
  Upload,
} from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  BarsOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import clsx from "clsx";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { GetProps } from "antd";
import { useSearchParams, useRouter } from "next/navigation";

import { convertByte } from "@/shared/utils/convertByte";

import { getListFile, deleteFile, downloadFile } from "@/service/api/file";
// import { downloadFile } from "@/service/api/file/actions";
import type { IFile } from "@/service/api/file/types";
import { queryKeys } from "@/constants/Common";
import { formatToLocalDateTime } from "@/shared/utils/time";
import ModalUpload from "./ModalUpload";
import { VideoPlayer } from "@/components/ui/video/video-player";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;

const ViewFile: React.FC<{ file: IFile }> = ({ file }) => {
  if (file.mimetype.includes("image")) {
    return (
      <div className="">
        {file.url ? (
          <ImageAntd
            src={file.url}
            alt={file.originalname}
            className="object-cover h-full w-full"
          />
        ) : (
          <ImageAntd
            src={"/image/thumbnail_default.jpg"}
            alt={"No thumbnail available"}
            className="object-cover h-full w-full"
          />
        )}
        <span className="text-gray-500 text-sm mb-1 block text-center">
          {file.originalname}
        </span>
      </div>
    );
  } else if (file.mimetype.includes("video")) {
    return (
      // <video controls className="w-full h-full">
      //   <source src={file.url} type={file.mimetype} />
      //   Your browser does not support the video tag.
      // </video>
      <VideoPlayer
        src={file.url}
        style={{
          height: 300,
        }}
      />
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center">
        <i className="bi bi-file-earmark-text text-4xl mb-2"></i>
        <span className="text-gray-500 text-sm mb-1">{file.originalname}</span>
        <span className="text-gray-400 text-xs">
          Định dạng chưa được hỗ trợ, vui lòng tải về.
        </span>
      </div>
    );
  }
};

const PreviewFile: React.FC<{ file: IFile }> = ({ file }) => {
  if (file.mimetype.includes("image")) {
    return (
      <>
        {file.url ? (
          <img
            src={file.url}
            alt={file.originalname}
            className="object-cover h-full w-full"
          />
        ) : (
          <img
            src={"/image/thumbnail_default.jpg"}
            alt={"No thumbnail available"}
            className="object-cover h-full w-full"
          />
        )}
      </>
    );
  } else if (file.mimetype.includes("video")) {
    return (
      <div className="relative w-full h-full bg-slate-800 flex items-center justify-center">
        {/* <img
          src={"/image/thumbnail_default.jpg"}
          alt={file.originalname}
          className="object-cover w-full h-full"
        /> */}
        <button
          className="absolute text-white text-4xl bg-opacity-50 rounded-full p-2"
          title="Play"
        >
          <i className="bi bi-play-fill"></i>
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center">
        <i className="bi bi-file-earmark-text text-4xl mb-2"></i>
        <span className="text-gray-500 text-sm mb-1">{file.originalname}</span>
      </div>
    );
  }
};

const ModalInfoFile = ({ file }: { file: IFile }) => {
  return Modal.info({
    title: "Thông tin tập tin",
    content: (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Tên tập tin:</span>
        <span className="text-sm">{file.originalname}</span>
        <span className="text-sm font-medium">Kích thước:</span>
        <span className="text-sm">{convertByte(file.size)}</span>
        <span className="text-sm font-medium">Loại tệp:</span>
        <span className="text-sm">{file.mimetype}</span>
        <span className="text-sm font-medium">Tác giả:</span>
        <span className="text-sm">
          {file.author?.fullname || "Không xác định"}
        </span>
        <span className="text-sm font-medium">Ngày tạo:</span>
        <span className="text-sm">{formatToLocalDateTime(file.createdAt)}</span>
      </div>
    ),
  });
};

// Component to display a single file card
const FileCard: React.FC<{
  file: IFile;
  page: number;
  limit: number;
  filters: {
    startDate?: string | undefined;
    endDate?: string | undefined;
    mimetype?: string | undefined;
    minSize?: number | undefined;
    maxSize?: number | undefined;
  };
}> = ({ file, page, limit, filters }) => {
  const queryClient = useQueryClient();
  //const [showOptions, setShowOptions] = useState(false);

  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [infoFileDelete, setInfoFileDelete] = useState<IFile | null>(null);

  const getFileIcon = (mimetype: string) => {
    if (mimetype.includes("image")) {
      return <i className="bi bi-image"></i>;
    } else if (mimetype.includes("video")) {
      return <i className="bi bi-film"></i>;
    } else {
      return <i className="bi bi-file-earmark-text"></i>;
    }
  };

  const handleDeleteFile = async (_id: string, key: string) => {
    setIsLoadingDelete(true);
    try {
      await deleteFile(key);
      setIsOpenModalDelete(false);
      setInfoFileDelete(null);
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_LIST_FILE, page, limit, filters],
      }); // invalidate cache
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_FILE_STATISTIC],
      });
      message.success("Xóa tập tin thành công");
    } catch (error) {
      message.error("Xóa tập tin thất bại");
    } finally {
      setIsLoadingDelete(false);
      return;
    }
  };

  const handleDownloadFile = async (url: string, fileName: string) => {
    // try {
    //   // 1. Gọi API, về Blob
    //   const response = await downloadFile(url);

    //   // 2. Xác định content-type an toàn
    //   const headers = response.headers || {};
    //   const contentType =
    //     headers["content-type"] ??
    //     headers["Content-Type"] ??
    //     "application/octet-stream";

    //   // 3. Tạo Blob từ data
    //   const blob = new Blob([response.data], { type: contentType });

    //   // 4. Lấy filename (từ header hoặc từ URL)
    //   let filename = url.split("/").pop() || "file";
    //   // console.log("filename", filename);
    //   const contentDisp =
    //     headers["content-disposition"] ?? headers["Content-Disposition"];
    //   if (contentDisp) {
    //     const m = /filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i.exec(
    //       contentDisp
    //     );
    //     if (m && m[1]) filename = decodeURIComponent(m[1]);
    //   }

    //   // 5. Tạo link & click để download
    //   const link = document.createElement("a");
    //   const objectUrl = window.URL.createObjectURL(blob);
    //   link.href = objectUrl;
    //   link.download = filename;
    //   document.body.appendChild(link);
    //   link.click();
    //   link.remove();

    //   // 6. Giải phóng
    //   window.URL.revokeObjectURL(objectUrl);

    //   message.success("Tải tập tin thành công");
    // } catch (error) {
    //   // console.error("Download failed:", error);
    //   message.error("Tải tập tin thất bại");
    // }
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Tải tập tin thành công");
  };

  return (
    <>
      <div
        className={clsx(
          "rounded-lg shadow-sm p-2 relative",
          "hover:shadow-md transition-shadow duration-200",
          "bg-slate-100 text-slate-900 hover:bg-slate-200",
          "dark:bg-zinc-800 dark:text-slate-200 dark:hover:bg-zinc-700"
        )}
        // onMouseEnter={() => setShowOptions(true)}
        // onMouseLeave={() => setShowOptions(false)}
      >
        <div className="flex items-center h-5 mb-2">
          {getFileIcon(file.mimetype)}

          <Link
            title={file.originalname}
            href={file.url}
            className="ml-2 font-medium text-sm truncate line-clamp-1 hover:text-sky-600"
          >
            {file.originalname}
          </Link>
          {true && (
            <Tooltip title="Thao tác khác">
              <Dropdown
                trigger={["click"]}
                menu={{
                  items: [
                    {
                      key: "preview",
                      label: (
                        <span className="flex items-center">
                          <EyeOutlined className="mr-2" />
                          Xem
                        </span>
                      ),
                      onClick: () => {
                        Modal.info({
                          title: "Preview",
                          content: <ViewFile file={file} />,
                        });
                      },
                    },
                    {
                      key: "download",
                      label: (
                        <span className="flex items-center">
                          <DownloadOutlined className="mr-2" />
                          Tải về
                        </span>
                      ),
                      onClick: () => {
                        handleDownloadFile(file.url, file.originalname);
                      },
                    },
                    {
                      key: "copy",
                      label: (
                        <span className="flex items-center">
                          <i className="bi bi-link-45deg mr-2"></i>
                          Sao chép liên kết
                        </span>
                      ),
                      onClick: () => {
                        navigator.clipboard.writeText(file.url);
                        message.open({
                          type: "success",
                          content: "Đã sao chép liên kết vào clipboard",
                        });
                      },
                    },
                    {
                      key: "info",
                      label: (
                        <span className="flex items-center">
                          <InfoCircleOutlined className="mr-2" />
                          Thông tin
                        </span>
                      ),
                      onClick: () => {
                        ModalInfoFile({
                          file: file,
                        });
                      },
                    },
                    {
                      key: "delete",
                      label: (
                        <span className="flex items-center text-red-500">
                          <i className="bi bi-trash-fill mr-2"></i>
                          Xóa
                        </span>
                      ),
                      onClick: () => {
                        setIsOpenModalDelete(true);
                        setInfoFileDelete(file);
                      },
                    },
                  ],
                }}
                placement="bottomRight"
                arrow
              >
                <button
                  className={clsx(
                    "absolute right-1 p-1 text-sm rounded-md",
                    "shadow-md transition-shadow duration-200",
                    "bg-slate-100 text-slate-900 hover:bg-slate-300",
                    "dark:bg-zinc-700 dark:text-slate-200 dark:hover:bg-zinc-800"
                  )}
                >
                  <i className="bi bi-three-dots"></i>
                </button>
              </Dropdown>
            </Tooltip>
          )}
        </div>

        <div className="relative h-40 w-full bg-gray-100 rounded mb-2 overflow-hidden">
          <PreviewFile file={file} />

          {/* {showOptions && (
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <Tooltip title="Preview">
              <Button
                type="primary"
                shape="circle"
                size="small"
                icon={<EyeOutlined />}
                className="bg-white text-gray-800 hover:bg-gray-200 shadow-md"
              />
            </Tooltip>
            <Tooltip title="Download">
              <Button
                type="primary"
                shape="circle"
                size="small"
                icon={<DownloadOutlined />}
                className="bg-white text-gray-800 hover:bg-gray-200 shadow-md"
              />
            </Tooltip>
          </div>
        )} */}
        </div>

        {file.createdAt && (
          <div className="text-xs text-gray-500 flex justify-between">
            <span>{formatToLocalDateTime(file.createdAt)}</span>
            <span>{convertByte(file.size)}</span>
          </div>
        )}
      </div>
      <Modal
        title={
          <div className="flex items-center gap-2">
            <DeleteOutlined
              style={{
                color: "red",
                fontSize: "20px",
              }}
            />
            <div>Xóa tập tin</div>
          </div>
        }
        open={isOpenModalDelete}
        onOk={() => {
          if (infoFileDelete) {
            return handleDeleteFile(infoFileDelete._id, infoFileDelete.key);
          }
          return message.error("Có lỗi xảy ra, vui lòng thử lại sau");
        }}
        onCancel={() => {
          setIsOpenModalDelete(false);
          setInfoFileDelete(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{
          danger: true,
        }}
        confirmLoading={isLoadingDelete}
      >
        Bạn có chắc chắn muốn xóa tập tin{" "}
        <strong className="text-red-500">{file.originalname}</strong>
      </Modal>
    </>
  );
};

const FileCardList: React.FC<{
  file: IFile;
  page: number;
  limit: number;
  filters: {
    startDate?: string | undefined;
    endDate?: string | undefined;
    mimetype?: string | undefined;
    minSize?: number | undefined;
    maxSize?: number | undefined;
  };
}> = ({ file, page, limit, filters }) => {
  const queryClient = useQueryClient();
  //const [showOptions, setShowOptions] = useState(false);

  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [infoFileDelete, setInfoFileDelete] = useState<IFile | null>(null);

  const getFileIcon = (mimetype: string) => {
    if (mimetype.includes("image")) {
      return <i className="bi bi-image text-lg"></i>;
    } else if (mimetype.includes("video")) {
      return <i className="bi bi-film text-lg"></i>;
    } else {
      return <i className="bi bi-file-earmark-text text-lg"></i>;
    }
  };

  const handleDeleteFile = async (_id: string, key: string) => {
    setIsLoadingDelete(true);
    try {
      await deleteFile(key);
      setIsOpenModalDelete(false);
      setInfoFileDelete(null);
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_LIST_FILE, page, limit, filters],
      }); // invalidate cache
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_FILE_STATISTIC],
      });
      message.success("Xóa tập tin thành công");
    } catch (error) {
      message.error("Xóa tập tin thất bại");
    } finally {
      setIsLoadingDelete(false);
      return;
    }
  };

  const handleDownloadFile = async (url: string, fileName: string) => {
    // try {
    //   // 1. Gọi API, về Blob
    //   const response = await downloadFile(url);

    //   // 2. Xác định content-type an toàn
    //   const headers = response.headers || {};
    //   const contentType =
    //     headers["content-type"] ??
    //     headers["Content-Type"] ??
    //     "application/octet-stream";

    //   // 3. Tạo Blob từ data
    //   const blob = new Blob([response.data], { type: contentType });

    //   // 4. Lấy filename (từ header hoặc từ URL)
    //   let filename = url.split("/").pop() || "file";
    //   // console.log("filename", filename);
    //   const contentDisp =
    //     headers["content-disposition"] ?? headers["Content-Disposition"];
    //   if (contentDisp) {
    //     const m = /filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i.exec(
    //       contentDisp
    //     );
    //     if (m && m[1]) filename = decodeURIComponent(m[1]);
    //   }

    //   // 5. Tạo link & click để download
    //   const link = document.createElement("a");
    //   const objectUrl = window.URL.createObjectURL(blob);
    //   link.href = objectUrl;
    //   link.download = filename;
    //   document.body.appendChild(link);
    //   link.click();
    //   link.remove();

    //   // 6. Giải phóng
    //   window.URL.revokeObjectURL(objectUrl);

    //   message.success("Tải tập tin thành công");
    // } catch (error) {
    //   // console.error("Download failed:", error);
    //   message.error("Tải tập tin thất bại");
    // }
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Tải tập tin thành công");
  };

  return (
    <>
      <div
        className={clsx(
          "flex items-center justify-start rounded-lg shadow-sm p-3",
          "hover:shadow-md transition-shadow duration-200",
          "gap-2",
          "bg-slate-100 text-slate-900 hover:bg-slate-200",
          "dark:bg-zinc-800 dark:text-slate-200 dark:hover:bg-zinc-700"
        )}
        // onMouseEnter={() => setShowOptions(true)}
        // onMouseLeave={() => setShowOptions(false)}
      >
        {/* truncate đi cùng với line-clamp-1 */}
        {getFileIcon(file.mimetype)}
        <div className="truncate flex flex-col">
          <Link
            title={file.originalname}
            href={file.url}
            className="font-medium text-sm truncate line-clamp-1 hover:text-sky-600"
          >
            {file.originalname}
          </Link>
          {file.createdAt && (
            <div className="text-xs text-gray-500 flex gap-2">
              <span>{formatToLocalDateTime(file.createdAt)}</span>
              <span>{convertByte(file.size)}</span>
            </div>
          )}
        </div>

        {true && (
          <Tooltip title="Thao tác khác">
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "preview",
                    label: (
                      <span className="flex items-center">
                        <EyeOutlined className="mr-2" />
                        Xem
                      </span>
                    ),
                    onClick: () => {
                      Modal.info({
                        title: "Preview",
                        content: <ViewFile file={file} />,
                      });
                    },
                  },
                  {
                    key: "download",
                    label: (
                      <span className="flex items-center">
                        <DownloadOutlined className="mr-2" />
                        Tải về
                      </span>
                    ),
                    onClick: () => {
                      handleDownloadFile(file.url, file.originalname);
                    },
                  },
                  {
                    key: "copy",
                    label: (
                      <span className="flex items-center">
                        <i className="bi bi-link-45deg mr-2"></i>
                        Sao chép liên kết
                      </span>
                    ),
                    onClick: () => {
                      navigator.clipboard.writeText(file.url);
                      message.open({
                        type: "success",
                        content: "Đã sao chép liên kết vào clipboard",
                      });
                    },
                  },
                  {
                    key: "info",
                    label: (
                      <span className="flex items-center">
                        <InfoCircleOutlined className="mr-2" />
                        Thông tin
                      </span>
                    ),
                    onClick: () => {
                      ModalInfoFile({
                        file: file,
                      });
                    },
                  },
                  {
                    key: "delete",
                    label: (
                      <span className="flex items-center text-red-500">
                        <i className="bi bi-trash-fill mr-2"></i>
                        Xóa
                      </span>
                    ),
                    onClick: () => {
                      setIsOpenModalDelete(true);
                      setInfoFileDelete(file);
                    },
                  },
                ],
              }}
              placement="bottomRight"
              arrow
            >
              <button
                className={clsx(
                  "absolute right-9 md:right-12 p-1 text-sm rounded-md",

                  "shadow-md transition-shadow duration-200",
                  "bg-slate-100 text-slate-900 hover:bg-slate-300",
                  "dark:bg-zinc-600 dark:text-slate-200 dark:hover:bg-zinc-700"
                )}
              >
                <i className="bi bi-three-dots"></i>
              </button>
            </Dropdown>
          </Tooltip>
        )}
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <DeleteOutlined
              style={{
                color: "red",
                fontSize: "20px",
              }}
            />
            <div>Xóa tập tin</div>
          </div>
        }
        open={isOpenModalDelete}
        onOk={() => {
          if (infoFileDelete) {
            return handleDeleteFile(infoFileDelete._id, infoFileDelete.key);
          }
          return message.error("Có lỗi xảy ra, vui lòng thử lại sau");
        }}
        onCancel={() => {
          setIsOpenModalDelete(false);
          setInfoFileDelete(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{
          danger: true,
        }}
        confirmLoading={isLoadingDelete}
      >
        Bạn có chắc chắn muốn xóa tập tin{" "}
        <strong className="text-red-500">{file.originalname}</strong>
      </Modal>
    </>
  );
};
import ModalUploadStream from "@/modules/file/ModalUploadStream";
// Main gallery component
const FileGallery: React.FC = () => {
  const queryClient = useQueryClient();
  const titleFileRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<{
    startDate?: string | undefined;
    endDate?: string | undefined;
    mimetype?: string | undefined;
    minSize?: number | undefined;
    maxSize?: number | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
    mimetype: undefined,
    minSize: undefined,
    maxSize: undefined,
  });
  const [mimetype, setMimetype] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<
    [start: any | null | undefined, end: any | null | undefined]
  >([null, null]);
  const [segmented, setSegmented] = useState<"List" | "Kanban">("Kanban");

  //console.log("filters: ", filters);
  const PAGE_FILE_RECENT = 1;
  const LIMIT_FILE_RECENT = 20;

  const router = useRouter();
  const searchParams = useSearchParams();

  const queryPage =
    searchParams.get("p") && !isNaN(Number(searchParams.get("p")))
      ? Number(searchParams.get("p"))
      : PAGE_FILE_RECENT;
  const queryLimit =
    searchParams.get("l") && !isNaN(Number(searchParams.get("l")))
      ? Number(searchParams.get("l"))
      : LIMIT_FILE_RECENT;

  const [_pageFileRecent, setPageFileRecent] = useState<number>(queryPage);
  const [_limitFileRecent, setLimitFileRecent] = useState<number>(queryLimit);

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

  const scrollTo = (element: React.RefObject<HTMLElement>) => {
    element.current?.scrollIntoView({});
  };

  const [isOpenModalUpload, setIsOpenModalUpload] = useState<boolean>(false);
  const [isOpenModalUploadStream, setIsOpenModalUploadStream] =
    useState<boolean>(false);

  const {
    data: dataFile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      queryKeys.GET_LIST_FILE,
      _pageFileRecent,
      _limitFileRecent,
      filters,
    ],
    queryFn: () => getListFile(_pageFileRecent, _limitFileRecent, filters),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  useEffect(() => {
    if (dataFile?.data?.data?.length === 0) {
      //ví dụ: limit 20 có 21 file xoá file thứ 21
      //console.log("dịch chuyển trang");
      setPageFileRecent(_pageFileRecent > 1 ? _pageFileRecent - 1 : 1);
      setLimitFileRecent(LIMIT_FILE_RECENT);
      updateQuery({
        p: _pageFileRecent > 1 ? (_pageFileRecent - 1).toString() : "1",
        l: LIMIT_FILE_RECENT.toString(),
      });
    }
  }, [dataFile]);

  //console.log("dataFile: ", dataFile);

  const onChangeSelectMimetype = (value: string) => {
    //console.log(`selected ${value}`);
    if (value === "") {
      setMimetype("");
    }
    setMimetype(value);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

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
    setPageFileRecent(1);
    setLimitFileRecent(_limitFileRecent);
    updateQuery({
      p: "1",
      l: _limitFileRecent.toString(),
    });
    scrollTo(titleFileRef);
    setFilters({
      ...filters,
      startDate: selectedDate[0] ? selectedDate[0]?.toISOString() : undefined,
      endDate: selectedDate[1] ? selectedDate[1]?.toISOString() : undefined,
      mimetype: mimetype ? mimetype : undefined,
    });
  };

  //console.log("filters", filters);

  // const handleCloseModalUpload = () => {
  //   setIsOpenModalUpload(false);
  //   setPathFileUpload("");
  //   setUrlFile("");
  //   setFileUpload(undefined);
  //   setLoadingFileUpload(false);
  // };

  const invalidateQueriesFile = async () => {
    queryClient.invalidateQueries({
      queryKey: [
        queryKeys.GET_LIST_FILE,
        _pageFileRecent,
        _limitFileRecent,
        filters,
      ],
    }); //invalidate cache
    queryClient.invalidateQueries({
      queryKey: [queryKeys.GET_FILE_STATISTIC],
    });
    queryClient.invalidateQueries({
      queryKey: [queryKeys.GET_INFO_USER],
    });
  };

  return (
    <>
      <div className="min-h-screen">
        <h2 className="text-2xl font-semibold mb-4" ref={titleFileRef}>
          Tập tin
        </h2>

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
        <style jsx>{``}</style>

        <div
          className={clsx(
            "custom-scrollbar-sidebar overflow-x-auto whitespace-nowrap py-4"
          )}
        >
          <div className="flex gap-4 px-4 w-max justify-end">
            <Button
              title="Upload stream"
              type="default"
              onClick={() => {
                setIsOpenModalUploadStream(true);
              }}
              className="px-3 py-2 bg-slate-400 rounded-md hover:bg-slate-500"
            >
              <i className="bi bi-cloud-upload"></i>
            </Button>
            <Button
              title="Tải lên"
              type="default"
              onClick={() => {
                setIsOpenModalUpload(true);
              }}
              className="px-3 py-2 bg-slate-400 rounded-md hover:bg-slate-500"
            >
              <i className="bi bi-upload"></i> Tải lên
            </Button>
            {/* <span className="text-sm text-gray-500">Thời gian:</span> */}
            <RangePicker
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
            {/* <span className="text-sm text-gray-500">Chọn kiểu:</span> */}
            <Select
              showSearch
              style={{ width: 100 }}
              placeholder="Chọn kiểu"
              optionFilterProp="label"
              onChange={onChangeSelectMimetype}
              onSearch={onSearch}
              options={[
                { value: "image", label: "Hình ảnh" },
                { value: "video", label: "Video" },
                { value: "document", label: "Tài liệu" },
                { value: "audio", label: "Âm thanh" },
                { value: "", label: "Tất cả" },
              ]}
              defaultValue={""}
            />

            <Button
              title="Tải lại"
              type="default"
              onClick={() => {
                invalidateQueriesFile();
              }}
              className="px-3 py-2 bg-slate-400 rounded-md hover:bg-slate-500"
            >
              <i className="bi bi-arrow-clockwise"></i> Tải lại
            </Button>
            <Segmented
              options={[
                { value: "List", icon: <BarsOutlined /> },
                { value: "Kanban", icon: <AppstoreOutlined /> },
              ]}
              value={segmented}
              onChange={(value) => {
                setSegmented(value as "List" | "Kanban");
              }}
            />
            <button
              className="p-1.5 bg-slate-400 rounded-md hover:bg-blue-600 w-1/5 sm:w-auto"
              onClick={handleSearch}
            >
              <i className="bi bi-search text-white" />
            </button>
          </div>
        </div>

        {segmented === "Kanban" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {dataFile &&
              dataFile?.data?.data?.length > 0 &&
              dataFile?.data?.data?.map((file) => (
                <FileCard
                  key={file._id}
                  file={file}
                  page={_pageFileRecent}
                  limit={_limitFileRecent}
                  filters={filters}
                />
              ))}
          </div>
        )}
        {segmented === "List" && (
          <div className="flex flex-col gap-2">
            {dataFile &&
              dataFile?.data?.data?.length > 0 &&
              dataFile?.data?.data?.map((file) => (
                <FileCardList
                  key={file._id}
                  file={file}
                  page={_pageFileRecent}
                  limit={_limitFileRecent}
                  filters={filters}
                />
              ))}
          </div>
        )}

        {isLoading && (
          <div
            className={clsx(
              "col-span-full flex justify-center items-center h-36 rounded-lg",
              "bg-slate-200 dark:bg-zinc-900"
            )}
          >
            <div className="text-center text-gray-500">Đang tải...</div>
          </div>
        )}
        {dataFile && dataFile?.data?.data?.length === 0 && (
          <div
            className={clsx(
              "col-span-full flex justify-center items-center h-36  rounded-lg",
              "bg-slate-200 dark:bg-zinc-900"
            )}
          >
            <div className="text-center text-gray-500">
              Không có file nào được tải lên
            </div>
          </div>
        )}
        {isError && (
          <div
            className={clsx(
              "col-span-full flex justify-center items-center h-36  rounded-lg",
              "bg-red-50 dark:bg-zinc-900"
            )}
          >
            <div className="text-center text-red-500">
              <button
                className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg"
                onClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: [
                      queryKeys.GET_LIST_FILE,
                      _pageFileRecent,
                      _limitFileRecent,
                      filters,
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

        <Pagination
          style={{
            marginTop: "40px",
            display:
              dataFile && dataFile?.data?.data?.length > 0 ? "block" : "none",
          }}
          onChange={(page: number, pageSize: number) => {
            // console.log("page", page);
            // console.log("pageSize", pageSize);
            setPageFileRecent(page);
            setLimitFileRecent(pageSize);
            updateQuery({
              p: page.toString(),
              l: pageSize.toString(),
            });
            scrollTo(titleFileRef);
          }}
          showSizeChanger={false}
          showQuickJumper={false}
          defaultPageSize={Number(_limitFileRecent)}
          defaultCurrent={Number(_pageFileRecent)}
          current={Number(_pageFileRecent)}
          total={dataFile?.data?.totalFiles}
        />
      </div>
      <ModalUpload
        isOpen={isOpenModalUpload}
        onCancel={() => setIsOpenModalUpload(false)}
        okText="Đóng"
        okType="default"
        onOk={() => setIsOpenModalUpload(false)}
        title="Tải lên tập tin"
        maxSize={10} //10MB
        onUploadSuccess={() => {
          message.success("Tải lên file thành công");
          invalidateQueriesFile(); //invalidate cache
        }}
        onUploadError={(error) => {
          message.error(
            error?.response?.data?.message ||
              "Đã có lỗi xảy ra. Vui lòng thử lại sau"
          );
        }}
        onRemoveSuccess={() => {
          invalidateQueriesFile(); //invalidate cache
        }}
      >
        <p className="ant-upload-drag-icon text-3xl">
          <i className="bi bi-cloud-arrow-up"></i>
        </p>
        <p className="ant-upload-text">Nhấn hoặc kéo thả file vào đây</p>
        <p className="ant-upload-hint">
          Hỗ trợ tải lên nhiều định dạng, tối đa 10MB
        </p>
      </ModalUpload>

      <ModalUploadStream
        isOpen={isOpenModalUploadStream}
        title={"Tải lên tập tin"}
        onOk={() => setIsOpenModalUploadStream(false)}
        onCancel={() => setIsOpenModalUploadStream(false)}
        onUploadSuccess={() => {
          invalidateQueriesFile(); //invalidate cache
        }}
      />
    </>
  );
};

export default FileGallery;
