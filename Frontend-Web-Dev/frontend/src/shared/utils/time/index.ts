export const formatToLocalDateTime = (isoDate: Date) => {
  const date = new Date(isoDate); //2025-03-02T16:36:17.498Z

  // Chuyển đổi giờ UTC sang GMT+7
  let offsetInMilliseconds = 7 * 60 * 60 * 1000; // GMT+7
  {
    process.env.NODE_ENV === "development" && (offsetInMilliseconds = 0);
  }
  {
    process.env.NODE_ENV === "production" && (offsetInMilliseconds = 0);
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
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};

export const formatToLocalDateTimePost = (isoDate: Date) => {
  const date = new Date(isoDate); //2025-03-02T16:36:17.498Z

  // Chuyển đổi giờ UTC sang GMT+7
  let offsetInMilliseconds = 7 * 60 * 60 * 1000; // GMT+7
  {
    process.env.NODE_ENV === "development" && (offsetInMilliseconds = 0);
  }
  // {
  //   process.env.NODE_ENV === "production" && (offsetInMilliseconds = 0);
  // }
  //số GMT+0 mặc định đã chuyển GMT+7
  const localTime = new Date(date.getTime() + offsetInMilliseconds);

  // Lấy các thành phần của ngày và giờ
  const hours = String(localTime.getHours()).padStart(2, "0");
  const minutes = String(localTime.getMinutes()).padStart(2, "0");
  const seconds = String(localTime.getSeconds()).padStart(2, "0");

  const day = String(localTime.getDate()).padStart(2, "0");
  const month = String(localTime.getMonth() + 1).padStart(2, "0"); // Tháng tính từ 0
  const year = localTime.getFullYear();

  // Lấy thứ trong tuần
  const daysOfWeek = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  const dayOfWeek = daysOfWeek[localTime.getDay()];

  // Trả về định dạng yêu cầu
  return `${dayOfWeek}, ngày ${day}/${month}/${year} - ${hours}:${minutes}`;
};

//hàm tính thời gian đã trôi qua từ thời điểm đăng bài viết
export const timeSince = (date: Date) => {
  // Chuyển đổi giờ UTC sang GMT+7
  let offsetInMilliseconds = 7 * 60 * 60 * 1000; // GMT+7
  {
    process.env.NODE_ENV === "development" && (offsetInMilliseconds = 0);
  }
  {
    process.env.NODE_ENV === "production" && (offsetInMilliseconds = 0);
  }

  const localTime = new Date().getTime() + offsetInMilliseconds;

  const seconds = Math.floor((localTime - new Date(date).getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} năm trước`;
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} tháng trước`;
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} ngày trước`;
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} giờ trước`;
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} phút trước`;
  return `${Math.floor(seconds)} giây trước`;
};

export const formatTimePost = (date: Date) => {
  if (!date) return "";
  const now = new Date();
  const input = new Date(date);
  const diff = (now.getTime() - input.getTime()) / 1000;

  if (diff < 60) {
    return "Vừa xong";
  } else if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins} phút${mins > 1 ? "" : ""} trước`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} giờ trước`;
  } else if (diff < 172800) {
    return "Hôm qua";
  } else if (now.getFullYear() === input.getFullYear()) {
    return input.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  } else {
    return input.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

export const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Intl.DateTimeFormat("vi-VN", options).format(new Date(date));
};

export const formatTimeMessage = (date: Date) => {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatTimeChatItem = (time: string | Date) => {
  if (!time) return "";
  const now = new Date();
  const messageTime = time instanceof Date ? time : new Date(time);
  const diffInHours =
    (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return messageTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInHours < 168) {
    // 7 days
    return messageTime.toLocaleDateString("vi-VN", { weekday: "short" });
  } else {
    return messageTime.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  }
};

//format dòng thời gian tin nhắn trong đoạn chat
export const formatTimeMessageChat = (time: string | Date) => {
  if (!time) return "";
  const now = new Date();
  const messageTime = time instanceof Date ? time : new Date(time);

  // Reset time for today, yesterday, and messageTime
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const msgDate = new Date(
    messageTime.getFullYear(),
    messageTime.getMonth(),
    messageTime.getDate()
  );

  if (msgDate.getTime() === today.getTime()) {
    // Today: show only time
    return messageTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (msgDate.getTime() === yesterday.getTime()) {
    // Yesterday
    return "Hôm qua";
  } else if (now.getFullYear() === messageTime.getFullYear()) {
    // Same year: show day/month
    return messageTime.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  } else {
    // Different year: show full date
    return messageTime.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};
