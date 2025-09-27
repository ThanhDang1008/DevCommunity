import { Role } from "@/service/api/role/types";

export enum PermissionType {
  UPLOAD_FILE = "UPLOAD_FILE",
}

type PermissionMap = [
  {
    name: PermissionType.UPLOAD_FILE;
    description: string;
    limit: string; //byte
  }
];

export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  status: string;
  avatar: string;
  type: string; //local, facebook, google, zalo
  id_role: Role;
  listFriendId: {
    _id: string;
    fullname: string;
    email: string;
    avatar: string;
  }[];
  permissions: PermissionMap;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export type GetInfoUser = {
  message: string;
  data: Omit<IUser, "password">;
};

export type DataUpdateUser = {
  fullname?: string;
  status?: string;
  id_role?: string;
  type?: string;
  avatar?: string;
};

export type GetAllUsers = {
  data: Omit<IUser, "password">[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
};

export type DataSetInfoUser = {
  id_user: string;
  fullname: string;
  email: string;
  password?: string;
  status: string;
  id_role: string;
  avatar?: string;
  type?: string; //local, facebook, google, zalo
};

export type GetListFriends = {
  message: string;
  data: {
    _id: string;
    listFriendId: IUser["listFriendId"];
  };
};

export type GetListRecommendFriend = {
  message: string;
  data: Array<Pick<IUser, "_id" | "fullname" | "email"| "avatar">>;
};
