import mongoose, { Schema, Document } from "mongoose";
import { statusPost } from "@modules/post/constants/common";

export interface IPost extends Document {
  _id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  toc: {
    title: string;
    id: string;
    tag: string;
  }[];
  thumbnail: string;
  link: {
    image: string[];
    video: string[];
  };
  category: string[];
  status: statusPost;
  author: Schema.Types.ObjectId;
  sharedByListUserId: Schema.Types.ObjectId[];
  view: number;
  rank: number;
  tags: string[];
  keywords: string[];
  reactions: IReactions[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IReactions {
  listUserId: string[];
  type: string; // EnumPostReactionType
}

// export enum EnumPostReactionType {
//   HEART = "heart",
//   UNICORN = "unicorn",
//   SURPRISED = "surprised",
//   CLAP = "clap",
//   FIRE = "fire",
// }

const ReactionsSchema: Schema = new Schema<IReactions>(
  {
    listUserId: { type: [String], default: [] },
    type: {
      type: String,
      required: true,
      //unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const PostSchema: Schema = new Schema<IPost>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  content: { type: String, required: true },
  toc: {
    type: [
      {
        title: { type: String },
        id: { type: String },
        tag: { type: String },
      },
    ],
    default: [],
  },
  thumbnail: { type: String, default: "" },
  link: {
    image: { type: [String], default: [] },
    video: { type: [String], default: [] },
  },
  category: { type: [String], default: [] },
  status: { type: String, required: true, enum: Object.values(statusPost) },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sharedByListUserId: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  view: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  keywords: { type: [String], default: [] },
  reactions: {
    type: [ReactionsSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

//-------------------- index ----------------------
PostSchema.index({
  slug: 1,
  createdAt: -1,
  status: 1,
}); //lấy chi tiết bài viết theo status và slug
PostSchema.index({
  status: 1,
  category: 1,
  createdAt: -1,
}); //lấy ra các bài viết theo (status), (category) và (thời gian tạo mới nhất)
PostSchema.index({ status: 1, createdAt: -1 }); // lấy ra các bài viết theo (status) và (thời gian tạo mới nhất)

export default mongoose.model<IPost>("Post", PostSchema);
