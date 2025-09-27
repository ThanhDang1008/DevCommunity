import mongoose, { Schema, Document } from "mongoose";

import { Role } from "@/constants/common";

export interface IRole extends Document {
  _id: string;
  role: Role;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const RoleSchema: Schema = new Schema<IRole>(
  {
    role: { type: String, required: true, enum: Object.values(Role) },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRole>("Role", RoleSchema);
