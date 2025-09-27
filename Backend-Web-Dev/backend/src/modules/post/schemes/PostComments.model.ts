import mongoose, { Schema, Document } from "mongoose";

export enum EnumStatusComment {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
  EDITED = "edited",
  PINNED = "pinned",
}

export interface IReactions {
  listUserId: string[];
  type: string;
}

export interface IPostComments extends Document {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  parentId: string | null;
  status: EnumStatusComment;
  reactions: IReactions[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

const ReactionsSchema: Schema = new Schema<IReactions>({
  listUserId: { type: [String], default: [] },
  type: { type: String, required: true },
});

const PostCommentsSchema: Schema = new Schema<IPostComments>({
  postId: { type: String, ref: "Post", required: true },
  userId: { type: String, ref: "User", required: true },
  content: { type: String, required: true },
  parentId: { type: String, ref: "PostComments", default: null },
  status: {
    type: String,
    enum: Object.values(EnumStatusComment),
    default: EnumStatusComment.ACTIVE,
  },
  reactions: {
    type: [ReactionsSchema],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

//-------------------- index ----------------------

export default mongoose.model<IPostComments>(
  "PostComments",
  PostCommentsSchema
);
