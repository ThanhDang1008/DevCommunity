import mongoose, { Schema, Document } from "mongoose";
import type { IRole } from "@/modules/role/schemes/role.model";
import type { IFriendRequests } from "@/modules/user/schemes/FriendRequests.model";

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

export interface IUserExperiences extends Document {
  title: string;
  description: string;
  company: string;
  location: {
    country: string;
    city: string;
    address: string;
  };
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
}

export interface IUserEducations extends Document {
  degree: string; //"Bachelor of Computer Science",
  fieldOfStudy: string; // "Information Technology",
  school: string; //"Đại học Bách Khoa Hà Nội",
  location: {
    country: string;
    city: string;
    address: string;
  };
  startDate: Date;
  endDate: Date | null;
}

enum EnumBadgeType {
  RECOGNITION = "recognition",
  STATUS = "status",
  SYSTEM = "system",
  CUSTOM = "custom",
}

export interface IUserBadges extends Document {
  name: string;
  type: EnumBadgeType;
  description: string;
  iconUrl: string;
  awardedAt: Date;
  expiresAt: Date | null;
  awardedBy: Schema.Types.ObjectId;
}

export interface IUser extends Document {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  status: string;
  phone: string;
  gender: string;
  birthday: Date;
  bio: string;
  location: {
    country: string;
    city: string;
    ward: string;
    address: string;
  };
  experiences: IUserExperiences[];
  educations: IUserEducations[];
  badges: IUserBadges[];
  
  avatar: string;
  type: string; //local, facebook, google, zalo
  id_role: Schema.Types.ObjectId | IRole;
  listFriendId: IUser[];
  friendRequestsId: IFriendRequests[];
  permissions: PermissionMap;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String },

    phone: { type: String, default: "" },
    gender: { type: String, default: "" },
    birthday: { type: Date, default: null },
    bio: { type: String, default: "" },
    location: {
      country: { type: String, default: "" },
      city: { type: String, default: "" },
      ward: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    experiences: {
      type: [Schema.Types.ObjectId],
      ref: "UserExperiences",
      default: [],
    },
    educations: {
      type: [Schema.Types.ObjectId],
      ref: "UserEducations",
      default: [],
    },
    badges: {
      type: [Schema.Types.ObjectId],
      ref: "UserBadges",
      default: [],
    },

    avatar: { type: String },
    type: { type: String }, //local, facebook, google, zalo
    id_role: { type: Schema.Types.ObjectId, ref: "Role" },
    listFriendId: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
        // This field is used to store the list of friends' IDs
      },
    ],
    friendRequestsId: [
      {
        type: Schema.Types.ObjectId,
        ref: "FriendRequests",
        default: [],
        // This field is used to store the list of friend request IDs
      },
    ],
    permissions: {
      type: [Object],
      default: [
        {
          name: PermissionType.UPLOAD_FILE,
          description: "Upload file",
          limit: `${200 * 1024 * 1024}`, // 200MB in bytes - 209715200
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

//index
// UserSchema.index({});

export default mongoose.model<IUser>("User", UserSchema);
