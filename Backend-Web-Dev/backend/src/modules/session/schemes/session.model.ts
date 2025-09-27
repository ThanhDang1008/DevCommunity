import mongoose, { Schema, Document } from "mongoose";
import { Role } from "@/constants/common";

export interface ISession extends Document {
  _id: string;
  session_id: string;
  id_user: string;
  email: string;
  token: string; // Optional field for JWT key
  expired_at: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const SessionSchema: Schema = new Schema<ISession>(
  {
    // Removed _id field configuration as it is not valid
    session_id: { type: String, required: true, unique: true },
    id_user: { type: String, required: true },
    email: { type: String, required: true },
    token: { type: String, default: "" }, // Optional field for JWT key
    expired_at: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // Mặc định là 7 ngày kể từ khi tạo
    }, //đơn vị giây (7 ngày)
  },
  {
    timestamps: true,
    // _id: false, // không tạo trường _id mới
  }
);

//index
SessionSchema.index(
  { expired_at: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 } // Tự động xóa sau 7 ngày
);

export default mongoose.model<ISession>("Session", SessionSchema);
