export type TypeFriendRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export enum EnumFriendRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface IFriendRequests {
  _id: string; // ID của yêu cầu kết bạn
  senderId: {
    _id: string; // ID người nhận yêu cầu kết bạn
    fullname: string; // Tên đầy đủ của người nhận yêu cầu kết bạn
    email: string; // Email của người nhận yêu cầu kết bạn
    avatar: string; // Ảnh đại diện của người nhận yêu cầu kết bạn (tùy chọn)
  }; // ID người nhận yêu cầu kết bạn // ID người gửi yêu cầu kết bạn
  receiverId: {
    _id: string; // ID người nhận yêu cầu kết bạn
    fullname: string; // Tên đầy đủ của người nhận yêu cầu kết bạn
    email: string; // Email của người nhận yêu cầu kết bạn
    avatar: string; // Ảnh đại diện của người nhận yêu cầu kết bạn (tùy chọn)
  }; // ID người nhận yêu cầu kết bạn
  message?: string; // Tin nhắn kèm theo yêu cầu kết bạn (tùy chọn)
  status: TypeFriendRequestStatus; // Trạng thái của yêu cầu kết bạn
  createdAt: Date; // Ngày tạo yêu cầu kết bạn
  updatedAt: Date; // Ngày cập nhật yêu cầu kết bạn
}

export type GetListFriendRequestsResponse = {
  message: string; // Thông điệp trả về
  data: IFriendRequests[]; // Danh sách yêu cầu kết bạn
};
