import mongoose from "mongoose";

import Post, { IPost } from "../schemes/post.model";
import { CreatePost, UpdatePost } from "../interfaces/post.interface";
import { statusPost } from "@modules/post/constants/common";
import { postCommentsService } from "@modules/post/service/PostComments/PostComments.service";

class PostService {
  public async createPost(data: CreatePost): Promise<any> {
    //console.log("createPost", data, data.createdAt);
    try {
      const post = await Post.create({
        slug: data.slug,
        title: data.title,
        description: data.description || "",
        content: data.content,
        toc: data.toc || [],
        link: {
          image: data?.link?.image || [],
          video: data?.link?.video || [],
        },
        thumbnail: data.thumbnail || "",
        category: data.category || [],
        status: data.status,
        author: data.author,
        rank: 0,
        view: 0,
        tags: data.tags || [],
        keywords: data.keywords || [],
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(), // Update updatedAt
      });
      if (!post) return null;
      const { content, ...postWithoutContent } = post.toObject();
      //console.log(postWithoutContent);
      return postWithoutContent;
    } catch (error) {
      throw error;
    }
  }
  public async updatePost(data: UpdatePost): Promise<any> {
    // console.log("updatePost", data);
    try {
      const post = await Post.findByIdAndUpdate(
        data._id,
        {
          title: data.title,
          description: data.description,
          content: data.content,
          toc: data.toc || [],
          thumbnail: data.thumbnail || "",
          link: {
            image: data?.link?.image || [],
            video: data?.link?.video || [],
          },
          category: data.category,
          tags: data.tags || [],
          keywords: data.keywords || [],
          status: data.status,
          createdAt: data.createdAt || new Date().toISOString(), // Update createdAt
          updatedAt: new Date().toISOString(), // Update updatedAt
        },
        {
          new: true,
        }
      );
      if (!post) return null;
      const { content, ...postWithoutContent } = post.toObject();
      return postWithoutContent;
    } catch (error) {
      throw error;
    }
  }

  public async deletePost(id: string): Promise<any> {
    try {
      const post = await Post.findByIdAndDelete(id);
      if (!post) return null;
      return true;
    } catch (error) {
      throw error;
    }
  }

  //slug_1_status_1
  public async getPostBySlug(slug: string): Promise<any> {
    try {
      const post = await Post.findOne({
        slug: slug,
        $or: [{ status: statusPost.PUBLIC }, { status: statusPost.SHARED }],
        createdAt: { $lte: new Date() }, // only fetch posts created up to the current time
      })
        .populate("author", "fullname avatar email")
        .populate({
          path: "category",
          model: "Tag",
          foreignField: "slug",
        })
        .populate({
          path: "reactions.listUserId",
          model: "User",
          select: "fullname avatar email",
        })
        .populate({
          path: "sharedByListUserId",
          model: "User",
          select: "fullname avatar email",
        });

      if (!post) return null;
      const totalComments = await postCommentsService.countAllCommentsByPostId(
        post._id
      );

      return {
        ...post.toObject(),
        totalComments,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getPostById(id: string): Promise<any> {
    try {
      const post = await Post.findById(id).populate({
        path: "category",
        model: "Tag", // Model chứa thông tin file đính kèm
        foreignField: "slug", //
      });
      if (!post) return null;
      return post;
    } catch (error) {
      throw error;
    }
  }

  public async getAllRecent(
    page: number,
    limit: number,
    id_user?: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      status?: string;
      author?: string;
      category?: string[];
      view?: "ASC" | "DESC";
      rank?: "ASC" | "DESC";
    }
  ): Promise<any> {
    const filterAuthor = id_user ? { author: id_user } : {};

    //------------ Query
    const query: any = {};

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

    // Lọc theo status
    if (filters?.status) {
      query.status = filters.status;
    }

    // Lọc theo author
    if (filters?.author) {
      query.author = filters.author;
    }

    // Lọc theo category
    if (filters?.category && filters?.category?.length > 0) {
      query.category = { $all: filters.category };
    }

    //------------ Sắp xếp (sort)
    const sort: any = {};

    if (filters?.rank) {
      query.rank = { $gt: 0 }; // Chỉ lấy các bài viết có rank lớn hơn 0
      sort.rank = filters.rank === "ASC" ? 1 : -1;
    }

    if (filters?.view) {
      sort.view = filters.view === "ASC" ? 1 : -1;
    }

    // Nếu không có yêu cầu gì thì mặc định sort theo updatedAt mới nhất
    if (Object.keys(sort).length === 0) {
      sort.updatedAt = -1;
    }

    try {
      const posts = await Post.find({
        ...filterAuthor,
        ...query,
      })
        .sort({
          ...sort,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-content")
        .populate("author", "fullname avatar email") // populate author
        .populate({
          path: "category",
          model: "Tag", // Model chứa thông tin file đính kèm
          foreignField: "slug", //
        });
      if (!posts) return null;
      return posts;
    } catch (error) {
      throw error;
    }
  }

  public async getCountAll(
    id_user?: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      status?: string;
      author?: string;
      category?: string[];
      view?: "ASC" | "DESC";
      rank?: "ASC" | "DESC";
    }
  ): Promise<any> {
    const filterAuthor = id_user ? { author: id_user } : {};

    //------------ Query
    const query: any = {};

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

    // Lọc theo status
    if (filters?.status) {
      query.status = filters.status;
    }

    // Lọc theo author
    if (filters?.author) {
      query.author = filters.author;
    }

    // Lọc theo category
    if (filters?.category && filters?.category?.length > 0) {
      query.category = { $all: filters.category };
    }

    //------------ Sắp xếp (sort)
    const sort: any = {};

    if (filters?.rank) {
      query.rank = { $gt: 0 }; // Chỉ lấy các bài viết có rank lớn hơn 0
      sort.rank = filters.rank === "ASC" ? 1 : -1;
    }

    if (filters?.view) {
      sort.view = filters.view === "ASC" ? 1 : -1;
    }

    // Nếu không có yêu cầu gì thì mặc định sort theo updatedAt mới nhất
    if (Object.keys(sort).length === 0) {
      sort.updatedAt = -1;
    }

    try {
      const count = await Post.countDocuments({
        ...filterAuthor,
        ...query,
      });
      return count;
    } catch (error) {
      throw error;
    }
  }

  public async getCountAllByCategory(
    category: string[],
    id_user?: string
  ): Promise<any> {
    const filterAuthor = id_user ? { author: id_user } : {};
    try {
      const count = await Post.countDocuments({
        category: { $all: category },
        ...filterAuthor,
      });
      return count;
    } catch (error) {
      throw error;
    }
  }

  //status_1_createdAt_-1
  // public async getAllRecentPublished(
  //   page: number,
  //   limit: number,
  //   listFriendId?: string[] | []
  // ): Promise<any> {
  //   try {
  //     const posts = await Post.find({
  //       status: statusPost.PUBLIC,
  //       createdAt: { $lte: new Date() }, // only fetch posts created up to the current time
  //     })
  //       .sort({
  //         createdAt: -1, // sort by createdAt desc
  //       })
  //       .skip((page - 1) * limit)
  //       .limit(limit)
  //       .select("-content")
  //       .populate({
  //         path: "category",
  //         model: "Tag", // Model chứa thông tin file đính kèm
  //         foreignField: "slug", //
  //       })
  //       .populate("author", "fullname avatar email"); // populate author
  //     if (!posts) return null;

  //     // Thêm field totalComments cho mỗi bài viết
  //     const postsWithComments = await Promise.all(
  //       posts.map(async (post: any) => {
  //         const totalComments =
  //           await postCommentsService.countAllCommentsByPostId(post._id);
  //         return {
  //           ...post.toObject(),
  //           totalComments,
  //         };
  //       })
  //     );

  //     return postsWithComments;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  public async getAllRecentPublished(data: {
    page: number;
    limit: number;
    listFriendId: string[] | [];
  }): Promise<any> {
    //console.log("getAllRecentPublished data", data);
    try {
      const friendObjectIds = data.listFriendId.map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      const pipeline: any[] = [
        {
          $match: {
            status: statusPost.PUBLIC,
            createdAt: { $lte: new Date() },
          },
        },
        {
          $addFields: {
            priority: {
              $cond: {
                if: { $in: ["$author", friendObjectIds] }, // ✅ ObjectId array
                then: 1,
                else: 0,
              },
            },
          },
        },
        {
          $sort: {
            priority: -1,
            createdAt: -1,
          },
        },
        {
          $skip: (data.page - 1) * data.limit,
        },
        {
          $limit: data.limit,
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: "$author",
        },
        {
          $lookup: {
            from: "tags",
            localField: "category",
            foreignField: "slug",
            as: "category",
          },
        },
        {
          $project: {
            content: 0,
            __v: 0,
            // priority: 0,
          },
        },
      ];

      const posts = await Post.aggregate(pipeline);

      const postsWithComments = await Promise.all(
        posts.map(async (post: any) => {
          const totalComments =
            await postCommentsService.countAllCommentsByPostId(post._id);
          return {
            ...post,
            totalComments,
          };
        })
      );

      return postsWithComments;
    } catch (error) {
      throw error;
    }
  }

  public async getCountAllRecentPublished(): Promise<any> {
    try {
      const count = await Post.countDocuments({
        status: statusPost.PUBLIC,
        //createdAt: { $lte: new Date() }, // only fetch posts created up to the current time
      });
      return count;
    } catch (error) {
      throw error;
    }
  }

  public async getAllByCategory(
    page: number,
    limit: number,
    category: string[],
    id_user?: string
  ): Promise<any> {
    const filterAuthor = id_user ? { author: id_user } : {};
    try {
      const posts = await Post.find({
        category: { $all: category },
        ...filterAuthor,
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-content")
        .populate("author", "fullname avatar email"); // populate author
      if (!posts) return null;
      return posts;
    } catch (error) {
      throw error;
    }
  }

  //status_1_category_1_createdAt_-1
  public async getAllByCategoryPublished(
    page: number,
    limit: number,
    category: string[]
  ): Promise<any> {
    try {
      const posts = await Post.find({
        category: { $all: category },
        status: statusPost.PUBLIC,
        createdAt: { $lte: new Date() }, // only fetch posts created up to the current time
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-content")
        .populate({
          path: "category",
          model: "Tag", // Model chứa thông tin file đính kèm
          foreignField: "slug", //
        });
      if (!posts) return null;
      return posts;
    } catch (error) {
      throw error;
    }
  }

  public async getCountAllByCategoryPublished(
    category: string[]
  ): Promise<any> {
    try {
      const count = await Post.countDocuments({
        category: { $all: category },
        status: statusPost.PUBLIC,
        //createdAt: { $lte: new Date() }, // only fetch posts created up to the current time
      });
      return count;
    } catch (error) {
      throw error;
    }
  }

  public async getAllByRank(_gte: number, _lte: number): Promise<any> {
    try {
      const posts = await Post.find({
        rank: { $gte: _gte, $lte: _lte },
      })
        .select("-content")
        .sort({
          rank: 1,
          createdAt: -1, // sort by createdAt desc
        }) // sort by rank asc
        .populate("author", "fullname avatar email") // populate author
        .populate({
          path: "category",
          model: "Tag", // Model chứa thông tin file đính kèm
          foreignField: "slug", //
        });

      if (!posts) return null;
      return posts;
    } catch (error) {
      throw error;
    }
  }

  public async updateRank(id: string, rank: number): Promise<any> {
    try {
      const post = await Post.findByIdAndUpdate(
        id,
        {
          rank: rank,
          updatedAt: new Date().toISOString(), // Update updatedAt
        },
        {
          new: true,
        }
      ).select("-content");
      if (!post) return null;
      return post;
    } catch (error) {
      throw error;
    }
  }

  public async deleteByCategory(category: string[]): Promise<any> {
    try {
      const post = await Post.deleteMany({
        category: {
          $all: category,
        },
      });
      if (!post) return null;
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async getAllByViewPublished(
    page: number,
    limit: number
  ): Promise<any> {
    try {
      const posts = await Post.find({
        status: statusPost.PUBLIC,
        createdAt: { $lte: new Date() }, // only fetch posts created up to the current time
      })
        .sort({
          view: -1,
          createdAt: -1, // sort by createdAt desc
        }) // sort by view desc
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-content")
        .populate({
          path: "category",
          model: "Tag", // Model chứa thông tin file đính kèm
          foreignField: "slug", //
        });
      if (!posts) return null;
      return posts;
    } catch (error) {
      throw error;
    }
  }

  //tăng view bài viết lên 1 by slug
  public async increaseView(slug: string): Promise<any> {
    try {
      const post = await Post.findOneAndUpdate(
        { slug: slug },
        {
          $inc: { view: 1 }, // tăng view lên 1
        },
        {
          // new: true
          timestamps: false, // không cập nhật thời gian tạo mới
        } // trả về bản ghi đã cập nhật
      );
      if (!post) return null;
      return post;
    } catch (error) {
      throw error;
    }
  }

  public async reactionPost(data: {
    postId: string;
    userId: string;
    type: string;
    increment: boolean;
  }): Promise<any> {
    try {
      //console.log("reactionPost", data);
      // Tìm post nhưng không cập nhật updatedAt
      const post = await Post.findById(data.postId).setOptions({
        timestamps: false,
      });
      if (!post) return null;

      // Tìm reaction tương ứng
      const reactionIndex = post.reactions.findIndex(
        (reaction) => reaction?.type === data?.type
      );

      if (reactionIndex !== -1) {
        const reaction = post.reactions[reactionIndex];
        const userIndex = reaction?.listUserId?.indexOf(data.userId);

        if (data.increment) {
          // Tăng reaction
          if (userIndex === -1) {
            // Nếu user chưa react, thêm user vào danh sách
            reaction.listUserId.push(data.userId);
          }
        } else {
          // Giảm reaction
          if (userIndex !== -1) {
            reaction.listUserId.splice(userIndex, 1);
            // // Nếu không còn user nào, có thể xóa reaction khỏi mảng
            // if (reaction.count === 0) {
            //   post.reactions.splice(reactionIndex, 1);
            // }
          }
        }
      } else {
        // Nếu chưa có reaction, thêm mới khi increment
        if (data.increment) {
          post.reactions.push({
            listUserId: [data.userId],
            type: data.type,
          });
        }
      }

      // Lưu lại nhưng không cập nhật updatedAt
      await post.save({ timestamps: false });
      return post;
    } catch (error) {
      throw error;
    }
  }

  public async getAllRecentPublishedByAuthor(data: {
    page: number;
    limit: number;
    authorId: string;
  }): Promise<any> {
    try {
      const posts = await Post.find({
        status: statusPost.PUBLIC,
        $or: [
          { author: data.authorId }, // lấy bài viết của tác giả
          { sharedByListUserId: { $in: [data.authorId] } }, // nếu tác giả có thể là người chia sẻ bài viết
        ],
        createdAt: { $lte: new Date() }, // only fetch posts created up to the current time
      })
        .sort({
          createdAt: -1, // sort by createdAt desc
        })
        .skip((data.page - 1) * data.limit)
        .limit(data.limit)
        .select("-content")
        .populate({
          path: "category",
          model: "Tag", // Model chứa thông tin file đính kèm
          foreignField: "slug", //
        })
        .populate("author", "fullname avatar email") // populate author
        .populate({
          path: "sharedByListUserId",
          model: "User",
          select: "fullname avatar email",
        });

      if (!posts) return null;

      // Thêm field totalComments cho mỗi bài viết
      const postsWithComments = await Promise.all(
        posts.map(async (post: any) => {
          const totalComments =
            await postCommentsService.countAllCommentsByPostId(post._id);
          return {
            ...post.toObject(),
            totalComments,
          };
        })
      );

      return postsWithComments;
    } catch (error) {
      throw error;
    }
  }

  public async getCountAllRecentPublishedByAuthor(
    authorId: string
  ): Promise<any> {
    try {
      const count = await Post.countDocuments({
        status: statusPost.PUBLIC,
        $or: [
          { author: authorId }, // lấy bài viết của tác giả
          { sharedByListUserId: { $in: [authorId] } }, // nếu tác giả có thể là người chia sẻ bài viết
        ],
      });
      return count;
    } catch (error) {
      throw error;
    }
  }

  public async updateSharedByListUserId(data: {
    postId: string;
    userId: string;
    increment: boolean;
  }): Promise<any> {
    try {
      const post = await Post.findById(data.postId);
      if (!post) return null;
      if (data.increment) {
        // Thêm user vào danh sách sharedByListUserId nếu chưa có
        if (!post.sharedByListUserId.includes(data.userId as any)) {
          post.sharedByListUserId.push(data.userId as any);
        }
      } else {
        // Xoá user khỏi danh sách sharedByListUserId
        post.sharedByListUserId = post.sharedByListUserId.filter(
          (userId) => userId.toString() !== data.userId
        );
      }
      await post.save();
      return post;
    } catch (error) {
      throw error;
    }
  }
}

export const postService: PostService = new PostService();
