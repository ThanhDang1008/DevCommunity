import { config } from "@/config.app";

export const formatToLocalDateTime = (isoDate: string) => {
  const date = new Date(isoDate); //2025-03-02T16:36:17.498Z

  // Chuyển đổi giờ UTC sang GMT+7
  let offsetInMilliseconds = 7 * 60 * 60 * 1000; // GMT+7
  {
    config.NODE_ENV === "development" && (offsetInMilliseconds = 0);
  }
  //số GMT+0 mặc định đã chuyển GMT+7
  const localTime = new Date(date.getTime() + offsetInMilliseconds);

  // Lấy các thành phần của ngày và giờ
  const hours = String(localTime.getHours()).padStart(2, "0");
  const minutes = String(localTime.getMinutes()).padStart(2, "0");
  const seconds = String(localTime.getSeconds()).padStart(2, "0");

  const day = String(localTime.getDate()).padStart(2, "0");
  const month = String(localTime.getMonth() + 1).padStart(2, "0"); // Tháng tính từ 0
  const year = localTime.getFullYear();

  // Trả về định dạng yêu cầu
  return `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
};
