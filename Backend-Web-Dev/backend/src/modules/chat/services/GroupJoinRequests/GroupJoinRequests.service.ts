import GroupJoinRequests, {
  IGroupJoinRequests,
  TypeReviewStatus,
} from "../../schemes/GroupJoinRequests.model";
import type { TypeCreateGroupJoinRequest } from "@modules/chat/interfaces/GroupJoinRequests";

class GroupJoinRequestsService {
  public async create(
    data: TypeCreateGroupJoinRequest
  ): Promise<IGroupJoinRequests | null> {
    try {
      const newRequest = await GroupJoinRequests.create({
        groupConversationId: data.groupConversationId,
        userId: data.userId,
        requestType: data.requestType,
        requestMessage: data.requestMessage || "",
        invitedBy: data.invitedBy || null,
      });

      return newRequest;
    } catch (error) {
      throw error;
    }
  }

  public async updateStatusJoinRequest(data: {
    groupJoinRequestId: string;
    reviewedBy: string;
    status: TypeReviewStatus;
  }): Promise<IGroupJoinRequests | null> {
    try {
      const updatedRequest = await GroupJoinRequests.findByIdAndUpdate(
        data.groupJoinRequestId,
        {
          reviewedBy: data.reviewedBy,
          reviewedAt: new Date(),
          reviewStatus: data.status, // Cập nhật trạng thái xem xét
        },
        { new: true }
      );
      if (!updatedRequest) return null;

      return updatedRequest;
    } catch (error) {
      throw error;
    }
  }

  public async deleteById(
    groupJoinRequestId: string
  ): Promise<IGroupJoinRequests | null> {
    try {
      const deletedRequest = await GroupJoinRequests.findByIdAndDelete(
        groupJoinRequestId
      );
      return deletedRequest;
    } catch (error) {
      throw error;
    }
  }

  public async getAllJoinRequestsByGroupId(
    groupConversationId: string
  ): Promise<IGroupJoinRequests[] | null> {
    try {
      const requests = await GroupJoinRequests.find({
        groupConversationId: groupConversationId,
      }).populate("userId", "fullname avatar email");

      if (!requests) {
        return null;
      }
      return requests;
    } catch (error) {
      throw error;
    }
  }
}

export const groupJoinRequestsService: GroupJoinRequestsService =
  new GroupJoinRequestsService();
