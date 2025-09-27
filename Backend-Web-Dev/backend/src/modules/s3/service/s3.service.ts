import mongoose from "mongoose";

import S3, { IS3 } from "../schemes/s3.model";
import { IUploadFile } from "../interface/s3.interface";
import { logError } from "@/shared/utils/log";

class S3Service {
  public async create(data: IUploadFile): Promise<any> {
    try {
      const s3 = await S3.create({
        key: data.key,
        url: data.url,
        mimetype: data.mimetype,
        originalname: data.originalname,
        size: data.size,
        bucket: data.bucket,
        author: data.author,
      });
      if (!s3) return null;
      return s3;
    } catch (error) {
      logError("s3-service", "create s3 fail", error);
      throw error;
    }
  }

  public async getByKey(key: string): Promise<IS3 | null> {
    try {
      const s3 = await S3.findOne({ key: key });
      return s3;
    } catch (error) {
      //throw error;
      logError("s3-service", "get s3 by key fail", error);
      return null;
    }
  }

  public async getByfilters(
    author: string,
    page: number,
    limit: number,
    filters?: {
      startDate?: string;
      endDate?: string;
      mimetype?: string;
      minSize?: number;
      maxSize?: number;
    }
  ): Promise<IS3[] | null> {
    try {
      const query: any = {};

      if (author) {
        query.author = author;
      }

      // Lọc theo ngày
      if (filters?.startDate || filters?.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = filters.startDate; // là lấy tất cả các file có ngày tạo sau ngày startDate
        }
        if (filters.endDate) {
          query.createdAt.$lte = filters.endDate; // là lấy tất cả các file có ngày tạo trước ngày endDate
        }
      }

      // Lọc theo mimetype (regex để hỗ trợ dạng "image" => "image/*")
      if (filters?.mimetype) {
        query.mimetype = { $regex: new RegExp(filters.mimetype, "i") };
      }

      // Lọc theo size
      if (filters?.minSize !== undefined || filters?.maxSize !== undefined) {
        query.size = {};
        if (filters.minSize !== undefined) {
          query.size.$gte = filters.minSize;
        }
        if (filters.maxSize !== undefined) {
          query.size.$lte = filters.maxSize;
        }
      }

      const s3 = await S3.find({
        ...query,
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("author", "fullname email -_id");
      if (!s3) return null;
      return s3;
    } catch (error) {
      throw error;
    }
  }

  public async getTotalFile(
    author: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      mimetype?: string;
      minSize?: number;
      maxSize?: number;
    }
  ): Promise<number | any> {
    try {
      const query: any = {};

      if (author) {
        query.author = author;
      }

      // Lọc theo ngày
      if (filters?.startDate || filters?.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = filters.startDate; // là lấy tất cả các file có ngày tạo sau ngày startDate
        }
        if (filters.endDate) {
          query.createdAt.$lte = filters.endDate; // là lấy tất cả các file có ngày tạo trước ngày endDate
        }
      }

      // Lọc theo mimetype (regex để hỗ trợ dạng "image" => "image/*")
      if (filters?.mimetype) {
        query.mimetype = { $regex: new RegExp(filters.mimetype, "i") };
      }

      // Lọc theo size
      if (filters?.minSize !== undefined || filters?.maxSize !== undefined) {
        query.size = {};
        if (filters.minSize !== undefined) {
          query.size.$gte = filters.minSize;
        }
        if (filters.maxSize !== undefined) {
          query.size.$lte = filters.maxSize;
        }
      }

      const total = await S3.countDocuments(query);
      return total;
    } catch (error) {
      throw error;
    }
  }

  public async deleteById(id: string): Promise<any> {
    try {
      const s3 = await S3.findByIdAndDelete(id);
      if (!s3) return null;
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async deleteByKey(key: string): Promise<any> {
    try {
      const s3 = await S3.deleteOne({ key: key });
      if (!s3) return null;
      return true;
    } catch (error) {
      //throw error;
      logError("s3-service", "delete s3 by key fail", error);
      return null;
    }
  }

  public async deleteMultipleByUrl(urls: string[]): Promise<any> {
    try {
      const s3 = await S3.deleteMany({ url: { $in: urls } });
      if (!s3) return null;
      return true;
    } catch (error) {
      //throw error;
      logError("s3-service", "delete s3 by urls fail", error);
      return null;
    }
  }

  public async getListSizeByAuthor(authorId: string): Promise<
    | {
        _id: {
          author: string;
          mimetype: string;
        };
        totalSize: number;
        count: number;
      }[]
    | any
  > {
    let query: any = {};
    if (authorId) {
      query.author = new mongoose.Types.ObjectId(authorId);
    }
    try {
      const s3 = await S3.aggregate([
        {
          $match: {
            ...query,
          },
        },
        {
          $group: {
            _id: { author: authorId ? "$author" : null, mimetype: "$mimetype" },

            totalSize: { $sum: "$size" },
            count: { $sum: 1 }, // đếm số lượng file
          },
        },
      ]);
      // console.log("s3", s3);
      //        [
      //   {
      //     _id: { author: null, mimetype: 'image/webp' },
      //     totalSize: 363350,
      //     count: 26
      //   },
      //   {
      //     _id: { author: null, mimetype: 'image/png' },
      //     totalSize: 5907368,
      //     count: 17
      //   },
      //   {
      //     _id: { author: null, mimetype: 'application/pdf' },
      //     totalSize: 17708795,
      //     count: 3
      //   }
      // ]
      if (!s3) return null;
      return s3;
    } catch (error) {
      //throw error;
      return null;
    }
  }

  public async getSizeByAuthor(authorId: string): Promise<
    | {
        _id: {
          author: string;
        };
        totalSize: number;
        count: number;
      }[]
    | null
  > {
    let query: any = {};
    if (authorId) {
      query.author = new mongoose.Types.ObjectId(authorId);
    }
    try {
      const s3 = await S3.aggregate([
        {
          $match: {
            ...query,
          },
        },
        {
          $group: {
            _id: { author: authorId ? "$author" : null },

            totalSize: { $sum: "$size" },
            count: { $sum: 1 }, // đếm số lượng file
          },
        },
      ]);

      if (!s3 || s3.length === 0) return null;
      return s3;
    } catch (error) {
      //throw error;
      return null;
    }
  }
}

export const s3Service: S3Service = new S3Service();
