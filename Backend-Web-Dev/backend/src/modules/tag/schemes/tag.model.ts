import mongoose, { Schema, Document } from "mongoose";

interface IChildTag {
  _id: string;
  name: string;
  slug: string | null;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ITag extends Document {
  _id: string;
  name: string;
  slug: string;
  description: string;
  child: IChildTag[] | [];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const ChildTagSchema: Schema = new Schema<IChildTag>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const TagSchema: Schema = new Schema<ITag>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    child: { type: [ChildTagSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

//index
TagSchema.index({
  slug: 1,
  "child.slug": 1,
});

export default mongoose.model<ITag>("Tag", TagSchema);
