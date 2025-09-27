import PostComments, {
  IPostComments,
  EnumStatusComment,
} from "@modules/post/schemes/PostComments.model";

class PostCommentsService {
  public async create(data: {
    postId: string;
    userId: string;
    content: string;
    parentId: string | null;
  }): Promise<IPostComments | null> {
    try {
      const newComment = await PostComments.create({
        postId: data.postId,
        userId: data.userId,
        content: data.content,
        parentId: data.parentId ? data.parentId : null,
        status: EnumStatusComment.ACTIVE,
        reactions: [],
      });
      const populatedComment = await PostComments.findById(newComment?._id)
        .populate("userId", "fullname email avatar")
        .lean();
      if (!populatedComment) {
        return null;
      }
      return populatedComment;
    } catch (error) {
      throw error;
    }
  }

  public async getAllByPostId(data: {
    postId: string;
    page: number;
    limit: number;
    replyPage?: number;
    replyLimit?: number;
    onlyParent?: boolean;
  }): Promise<any[]> {
    try {
      const {
        postId,
        page,
        limit,
        replyPage = 1,
        replyLimit = 5,
        onlyParent = false,
      } = data;

      // 1. Lấy comments cha phân trang
      const parentComments = await PostComments.find({
        postId,
        parentId: null,
      })
        .populate("userId", "fullname email avatar")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const parentIds = parentComments.map((c) => c._id);

      // 2. Lấy tổng số replies cho các comment cha
      const replyCounts = await PostComments.aggregate([
        {
          $match: {
            parentId: { $in: parentIds.map((id) => id.toString()) },
          },
        },
        {
          $group: {
            _id: "$parentId",
            total: { $sum: 1 },
          },
        },
      ]);

      const replyCountMap: Record<string, number> = {};
      for (const rc of replyCounts) {
        replyCountMap[rc._id] = rc.total;
      }

      // 3. Nếu onlyParent = true ➔ return không có replies chi tiết
      if (onlyParent) {
        return parentComments.map((comment) => ({
          ...comment,
          replies: [],
          totalReplies: replyCountMap[comment._id.toString()] || 0,
        }));
      }

      // 4. Lấy replies nếu onlyParent = false
      const replies = await PostComments.aggregate([
        {
          $match: {
            parentId: { $in: parentIds.map((id) => id.toString()) },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: "$parentId",
            total: { $sum: 1 },
            replies: {
              $push: "$$ROOT",
            },
          },
        },
        {
          $project: {
            _id: 1,
            total: 1,
            replies: {
              $slice: ["$replies", (replyPage - 1) * replyLimit, replyLimit],
            },
          },
        },
      ]);

      const replyMap: Record<string, any> = {};
      for (const r of replies) {
        replyMap[r._id] = {
          total: r.total,
          replies: r.replies,
        };
      }

      // 5. Gán replies vào parentComments
      const result = parentComments.map((comment) => ({
        ...comment,
        replies: replyMap[comment._id.toString()]?.replies || [],
        totalReplies: replyMap[comment._id.toString()]?.total || 0,
      }));

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async getCountAllByPostId(postId: string): Promise<number> {
    try {
      const count = await PostComments.countDocuments({
        postId: postId,
        parentId: null, // Chỉ đếm comment cha
      });
      return count;
    } catch (error) {
      throw error;
    }
  }

  public async getRepliesByParentId(data: {
    parentId: string;
    page: number;
    limit: number;
  }): Promise<any[]> {
    try {
      const { parentId, page, limit } = data;

      // 1. Lấy replies phân trang
      const replies = await PostComments.find({
        parentId: parentId,
      })
        .populate("userId", "fullname email avatar")
        .sort({ createdAt: -1 }) // sort mới nhất trước
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      return replies;
    } catch (error) {
      throw error;
    }
  }

  public async getCountAllRepliesByParentId(parentId: string): Promise<number> {
    try {
      const count = await PostComments.countDocuments({
        parentId: parentId,
      });
      return count;
    } catch (error) {
      throw error;
    }
  }

  public async deleteById({
    commentId,
    parentId,
  }: {
    commentId: string;
    parentId: string | null;
  }): Promise<boolean> {
    try {
      // Xoá comment chính
      const result = await PostComments.deleteOne({ _id: commentId });

      // Nếu là comment cha, xoá luôn các replies
      if (parentId === null) {
        await PostComments.deleteMany({ parentId: commentId });
      }

      return result?.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  public async countAllCommentsByPostId(postId: string): Promise<number> {
    try {
      const count = await PostComments.countDocuments({
        postId: postId,
      });
      return count;
    } catch (error) {
      throw error;
    }
  }

  public async updateReaction(data: {
    commentId: string;
    userId: string;
    type: string;
    increment: boolean;
  }): Promise<IPostComments | null> {
    try {
      // Tìm comment nhưng không cập nhật updatedAt
      const comment = await PostComments.findById(data.commentId).setOptions({
        timestamps: false,
      });
      if (!comment) return null;

      // Tìm reaction tương ứng
      const reactionIndex = comment.reactions.findIndex(
        (reaction) => reaction?.type === data.type
      );

      if (reactionIndex !== -1) {
        //tìm thấy reaction
        const reaction = comment.reactions[reactionIndex];
        const userIndex = reaction?.listUserId?.indexOf(data.userId);

        if (data.increment) {
          // Tăng reaction
          if (userIndex === -1) {
            reaction.listUserId.push(data.userId);
          }
        } else {
          // Giảm reaction
          if (userIndex !== -1) {
            reaction.listUserId.splice(userIndex, 1);
            // Nếu không còn user nào, có thể xóa reaction khỏi mảng
            // if (reaction.listUserId.length === 0) {
            //   comment.reactions.splice(reactionIndex, 1);
            // }
          }
        }
      } else {
        // Nếu chưa có reaction, thêm mới khi increment
        if (data.increment) {
          comment.reactions.push({
            listUserId: [data.userId],
            type: data.type,
          });
        }
      }

      // Lưu lại nhưng không cập nhật updatedAt
      await comment.save({ timestamps: false });
      return comment;
    } catch (error) {
      throw error;
    }
  }

  public async updateContent(data: {
    commentId: string;
    content: string;
  }): Promise<IPostComments | null> {
    try {
      const comment = await PostComments.findById(data.commentId);
      if (!comment) return null;
      comment.content = data.content;
      comment.status = EnumStatusComment.EDITED; // Cập nhật trạng thái thành EDITED
      comment.updatedAt = new Date(); // Cập nhật thời gian sửa đổi
      await comment.save();
      return comment;
    } catch (error) {
      throw error;
    }
  }
}

export const postCommentsService: PostCommentsService =
  new PostCommentsService();
