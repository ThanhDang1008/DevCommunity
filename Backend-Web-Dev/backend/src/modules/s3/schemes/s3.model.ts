import mongoose, { Schema, Document } from "mongoose";

export interface IS3 extends Document {
  _id: string;
  key: string;
  url: string;
  mimetype: string;
  originalname: string;
  size: number;
  bucket: string;
  author: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const S3Schema: Schema = new Schema<IS3>(
  {
    key: { type: String, required: true },
    url: { type: String, required: true },
    mimetype: { type: String, required: true },
    originalname: { type: String, default: "" },
    size: { type: Number, default: 0 },
    bucket: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

//index
S3Schema.index({ author: 1 });

export default mongoose.model<IS3>("S3", S3Schema);
