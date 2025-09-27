import FriendRequests, {
  IFriendRequests,
  EnumFriendRequestStatus,
} from "@/modules/user/schemes/FriendRequests.model";

class FriendRequestsService {
  public async create(data: {
    userId: string;
    friendId: string;
    requestMessage?: string;
    status?: EnumFriendRequestStatus;
  }): Promise<IFriendRequests | null> {
    try {
      const newRequest = await FriendRequests.create({
        senderId: data.userId,
        receiverId: data.friendId,
        message: data.requestMessage || "",
        status: data.status || EnumFriendRequestStatus.PENDING,
      });
      return newRequest;
    } catch (error) {
      throw error;
    }
  }

  public async getAllFriendRequestsBySenderId(
    userId: string
  ): Promise<IFriendRequests[] | null> {
    try {
      const requests = await FriendRequests.find({
        senderId: userId,
      }).populate({
        path: "receiverId",
        select: "_id fullname avatar email",
      });
      return requests;
    } catch (error) {
      throw error;
    }
  }

  public async getAllFriendRequestsByReceiverId(
    userId: string
  ): Promise<IFriendRequests[] | null> {
    try {
      const requests = await FriendRequests.find({
        receiverId: userId,
      }).populate({
        path: "senderId",
        select: "_id fullname avatar email",
      });
      return requests;
    } catch (error) {
      throw error;
    }
  }

  public async deleteById(
    friendRequestId: string
  ): Promise<IFriendRequests | null> {
    try {
      const deletedRequest = await FriendRequests.findByIdAndDelete(
        friendRequestId
      );
      return deletedRequest;
    } catch (error) {
      throw error;
    }
  }

  public async deleteBySenderIdAndReceiverId(
    senderId: string,
    receiverId: string
  ): Promise<IFriendRequests | null> {
    try {
      const deletedRequest = await FriendRequests.findOneAndDelete({
        senderId: senderId,
        receiverId: receiverId,
      });
      return deletedRequest;
    } catch (error) {
      throw error;
    }
  }

  public async updateStatusFriendRequest(data: {
    friendRequestId: string;
    status: EnumFriendRequestStatus;
  }): Promise<IFriendRequests | null> {
    try {
      const updatedRequest = await FriendRequests.findByIdAndUpdate(
        data.friendRequestId,
        {
          status: data.status, // Update the status of the friend request
        },
        { new: true }
      );
      if (!updatedRequest) return null;

      return updatedRequest;
    } catch (error) {
      throw error;
    }
  }
}

export const friendRequestsService: FriendRequestsService =
  new FriendRequestsService();
