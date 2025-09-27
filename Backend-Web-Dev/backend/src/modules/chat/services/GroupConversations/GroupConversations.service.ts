import GroupConversations, {
  IGroupConversations,
} from "../../schemes/GroupConversations.model";
import { ICreateGroupConversation } from "@modules/chat/interfaces/GroupConversations";
import { avatar_default_group } from "@/constants/common";
import { BadRequestError } from "@/shared/globals/exceptions/error-handler";
import { enumRoleParticipant } from "../../schemes/GroupConversations.model";
import type { TypePermissionsParticipant } from "../../schemes/GroupConversations.model";

import { groupMessagesService } from "@modules/chat/services/GroupMessages/GroupMessages.service";
import i18n from "@/shared/utils/language/i18n";

class GroupConversationsService {
  public async create(data: ICreateGroupConversation): Promise<any> {
    try {
      const groupConversation = await GroupConversations.create({
        title: data.title,
        description: data.description,
        topics: data.topics.length > 0 ? data.topics : [],
        avatar: data.avatar || avatar_default_group,
        createdBy: data.createdBy,
        participants: [
          {
            userId: data.userId,
            role: "CREATOR",
            permissions: {
              can_send_messages: true,
              can_send_media: true,
              can_send_polls: true,
              can_change_info: true,
              can_invite_users: true,
              can_pin_messages: true,
              can_delete_messages: true,
              can_kick_users: true,
              can_restrict_members: true,
              can_promote_members: true,
            },
          },
          ...(data.members.length > 0
            ? data.members.map((member) => ({
                userId: member.userId,
                invitedBy: data.createdBy,
              }))
            : []),
        ],
        settings: {
          isPublic: data.isPublic || false, // mặc định là privated
        },
      });
      return groupConversation;
    } catch (error) {
      throw error;
    }
  }

  public async getAllByUserId(userId: string): Promise<any> {
    try {
      const groupConversations = await GroupConversations.find({
        "participants.userId": userId,
      })
        .populate("participants.userId", "fullname avatar email")
        .populate({
          path: "lastMessageId",
          populate: {
            path: "senderId",
            select: "fullname", // nếu cần
          },
        })
        .select("-settings.defaultPermissions") // không cần settings
        .sort({ createdAt: -1 })
        .lean(); // chuyển sang plain object để dễ xử lý thêm thuộc tính

      // Chỉ giữ lại participant là userId truyền vào
      groupConversations.forEach((group) => {
        group.participants = group.participants.filter(
          (p: any) => p.userId && p?.userId?._id?.toString() === userId
        );
      });

      const unreadCounts = await Promise.all(
        groupConversations.map(async (group) => {
          const participant = group.participants.find(
            (p: any) => p?.userId?._id?.toString() === userId
          );
          //console.log("participant", participant);
          if (!participant) return 0;

          const lastReadAt = participant.lastReadAt;

          const count = await groupMessagesService.unreadCountsMessages(
            group._id.toString(),
            userId,
            lastReadAt
          );
          //console.log("count", count);

          // gắn vào group
          group.unreadCount = count;

          return count;
        })
      );

      return groupConversations; // mỗi group có thêm field: unreadCount
    } catch (error) {
      throw error;
    }
  }

  public async getAll(): Promise<any> {
    try {
      const groupConversations = await GroupConversations.find()
        .populate({
          path: "participants.userId",
          select: "fullname avatar email",
        })
        .select("-settings.defaultPermissions -lastMessageId") // không cần settings
        .populate({ path: "createdBy", select: "fullname avatar email" })
        .populate({
          path: "groupJoinRequestsId",
          select: "userId groupConversationId",
        })
        .sort({ createdAt: -1 }) // sắp xếp theo ngày tạo mới nhất
        .lean(); // chuyển sang plain object để dễ xử lý thêm thuộc tính

      // Chỉ giữ lại userId và role trong participants
      groupConversations.forEach((group: any) => {
        group.participants = group.participants.map((p: any) => ({
          userId: p.userId,
          role: p.role,
        }));
      });

      return groupConversations;
    } catch (error) {
      throw error;
    }
  }

  public async getDetailById(
    groupId: string
  ): Promise<IGroupConversations | null> {
    try {
      const groupConversation = await GroupConversations.findById(groupId)
        .populate("participants.userId", "fullname avatar email")
        .populate({
          path: "lastMessageId",
          populate: {
            path: "senderId",
            select: "fullname", // nếu cần
          },
        })
        .populate({
          path: "listFileKey",
          model: "S3", // Model chứa thông tin file đính kèm
          foreignField: "key",
          populate: {
            path: "author",
            select: "fullname avatar email", // Chọn các trường cần thiết
          },
        }) // Populate file đính kèm nếu có
        .populate({ path: "createdBy", select: "fullname avatar email" })
        .lean(); // chuyển sang plain object để dễ xử lý thêm thuộc tính
      if (!groupConversation) {
        throw new BadRequestError(
          i18n.__("modules.chat.group-conversations.get.detail.error"),
          "GROUP_NOT_FOUND"
        );
      }

      return groupConversation;
    } catch (error) {
      throw error;
    }
  }

  public async getAllByRoot(): Promise<any> {
    try {
      const groupConversations = await GroupConversations.find()
        .populate("participants.userId", "fullname avatar email")
        .populate("lastMessageId")
        .sort({ createdAt: -1 }); //sắp xếp theo ngày tạo mới nhất

      return groupConversations;
    } catch (error) {
      throw error;
    }
  }

  public async updateLastMessage(
    groupId: string,
    lastMessageId: string
  ): Promise<IGroupConversations | null> {
    try {
      const updatedGroup = await GroupConversations.findByIdAndUpdate(
        groupId,
        { lastMessageId: lastMessageId },
        { new: true }
      ).populate({
        path: "lastMessageId",
        populate: [
          {
            path: "senderId",
            select: "fullname avatar email", // nếu cần
          },
          {
            path: "content.media.fileId",
            model: "S3", // Model chứa thông tin file đính kèm
            foreignField: "key", // Populate dựa trên trường 'key' của S3
            select: "-author", // Chọn các trường cần thiết, loại trừ 'author'
          },
          {
            path: "replyToId",
            populate: {
              path: "senderId",
              select: "fullname avatar email",
            },
          },
        ],
      });
      return updatedGroup;
    } catch (error) {
      throw error;
    }
  }

  public async joinGroup({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }): Promise<any> {
    try {
      const group = await GroupConversations.findById(groupId);

      if (!group)
        throw new BadRequestError(
          i18n.__("modules.chat.group-conversations.update.join.error"),
          "GROUP_NOT_FOUND"
        );

      // Kiểm tra đã tham gia chưa
      const alreadyJoined = group.participants.some(
        (p) => p.userId.toString() === userId
      );
      if (alreadyJoined)
        throw new BadRequestError(
          i18n.__("modules.chat.group-conversations.update.join.error"),
          "ALREADY_JOINED"
        );

      // Kiểm tra giới hạn số lượng thành viên
      if (group.participants.length >= group.settings.maxMembers) {
        throw new BadRequestError(
          i18n.__("modules.chat.group-conversations.update.join.error"),
          "MAX_MEMBERS_REACHED"
        );
      }

      // Tạo participant mới
      const newParticipant = {
        userId: userId as any, // ép kiểu về ObjectId nếu cần
        permissions: group.settings.defaultPermissions,
      };

      // Thêm vào participants
      group.participants.push(newParticipant);
      await group.save();

      return group;
    } catch (error) {
      throw error;
    }
  }

  public async readNewMessages({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }): Promise<any> {
    try {
      const group = await GroupConversations.findOne({
        _id: groupId,
        "participants.userId": userId,
      });
      if (!group) throw new Error("Group not found or user not a participant");
      // Cập nhật lastReadAt cho participant
      const participant = group.participants.find(
        (p) => p.userId.toString() === userId
      );
      if (!participant) throw new Error("Participant not found");
      participant.lastReadAt = new Date();
      await group.save();
      return group;
    } catch (error) {
      throw error;
    }
  }

  public async updateJoinRequest(data: {
    groupId: string;
    groupJoinRequestId: string;
    type: "add" | "remove";
  }): Promise<any> {
    try {
      let updateQuery: any = {};
      if (data.type === "add") {
        updateQuery = {
          $push: { groupJoinRequestsId: data.groupJoinRequestId }, // Thêm vào mảng groupJoinRequests nếu chưa có
        };
      } else if (data.type === "remove") {
        updateQuery = {
          $pull: { groupJoinRequestsId: data.groupJoinRequestId }, // Xóa yêu cầu khỏi mảng groupJoinRequests
        };
      }

      const group = await GroupConversations.findByIdAndUpdate(
        data.groupId,
        {
          ...updateQuery,
        },
        { new: true }
      );
      return group;
    } catch (error) {
      throw error;
    }
  }

  public async deleteJoinRequestsId(data: {
    groupId: string;
    groupJoinRequestId: string;
  }): Promise<any> {
    try {
      const group = await GroupConversations.findByIdAndUpdate(
        data.groupId,
        {
          $pull: { groupJoinRequestsId: data.groupJoinRequestId }, // Xóa yêu cầu khỏi mảng groupJoinRequests
        },
        { new: true }
      );
      return group;
    } catch (error) {
      throw error;
    }
  }

  public async addListFileId({
    groupId,
    listFileKey,
  }: {
    groupId: string;
    listFileKey: string[]; // Mảng chứa các fileId cần thêm
  }): Promise<IGroupConversations | null> {
    try {
      const updatedGroup = await GroupConversations.findByIdAndUpdate(
        groupId,
        { $addToSet: { listFileKey: { $each: listFileKey } } } // Thêm các fileId vào mảng listFileId
      );
      return updatedGroup;
    } catch (error) {
      throw error;
    }
  }

  public async leaveGroup({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }): Promise<IGroupConversations | null> {
    try {
      const group = await GroupConversations.findById(groupId);
      if (!group) {
        throw new BadRequestError(
          i18n.__("modules.chat.group-conversations.update.leave.error"),
          "GROUP_NOT_FOUND"
        );
      }

      // Tìm participant
      const participantIndex = group.participants.findIndex(
        (p) => p?.userId?.toString() === userId
      );
      if (participantIndex === -1) {
        throw new BadRequestError(
          i18n.__("modules.chat.group-conversations.update.leave.error"),
          "NOT_A_PARTICIPANT"
        );
      }

      // Nếu là CREATOR thì xoá luôn nhóm
      if (
        group.participants[participantIndex].role ===
        enumRoleParticipant.CREATOR
      ) {
        const deletedGroup = await GroupConversations.findByIdAndDelete(
          groupId
        );
        //console.log("Deleted group:", deletedGroup);
        return deletedGroup;
      }

      // Xóa participant
      group.participants.splice(participantIndex, 1);
      await group.save();

      return group;
    } catch (error) {
      throw error;
    }
  }

  public async updatePermissionsParticipant({
    groupId,
    userId,
    role,
    permissions,
  }: {
    groupId: string;
    userId: string;
    role: enumRoleParticipant;
    permissions: TypePermissionsParticipant; // Chứa các quyền cần cập nhật
  }): Promise<IGroupConversations | null> {
    try {
      const group = await GroupConversations.findById(groupId);
      if (!group) {
        throw new BadRequestError(
          i18n.__("modules.chat.group-conversations.update.permissions.error"),
          "GROUP_NOT_FOUND"
        );
      }

      // Tìm participant
      const participant = group.participants.find(
        (p) => p.userId.toString() === userId
      );
      if (!participant) {
        throw new BadRequestError(
          i18n.__("modules.chat.group-conversations.update.permissions.error"),
          "PARTICIPANT_NOT_FOUND"
        );
      }

      // Cập nhật role và permissions
      participant.role = role;
      participant.permissions = permissions;

      await group.save();
      return group;
    } catch (error) {
      throw error;
    }
  }

  public async updateInfoGroup(
    groupId: string,
    data: {
      title?: string;
      description?: string;
      avatar?: string;
      topics?: string[];
    }
  ): Promise<IGroupConversations | null> {
    //console.log("data: ", data);
    try {
      const updatedGroup = await GroupConversations.findByIdAndUpdate(
        groupId,
        {
          ...data,
        },
        { new: true } // trả về bản ghi đã cập nhật
      );
      return updatedGroup;
    } catch (error) {
      throw error;
    }
  }
}

export const groupConversationsService: GroupConversationsService =
  new GroupConversationsService();
