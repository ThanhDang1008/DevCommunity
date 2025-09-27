import { Request, Response, NextFunction } from "express";

import { logError } from "@/shared/utils/log";
import {
  ServerError,
  BadRequestError,
  JoiRequestValidationError,
} from "@/shared/globals/exceptions/error-handler";
import { parseMongoError } from "@/shared/globals/exceptions/error-parser";
import {
  enumPermissionsParticipant,
  enumRoleParticipant,
} from "@/modules/chat/schemes/GroupConversations.model";
import type { TypePermissionsParticipant } from "@/modules/chat/schemes/GroupConversations.model";

import { groupConversationsService } from "@modules/chat/services/GroupConversations/GroupConversations.service";

export class UpdateGroupConversations {
  public async joinGroupPublic(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    const { groupId } = req.body;

    const missingFields = [];
    if (!groupId) missingFields.push("groupId");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    try {
      const groupConversation = await groupConversationsService
        .joinGroup({
          groupId: groupId,
          userId: session.id_user,
        })
        .catch((error) => {
          logError("update", "Join group conversation failed", error);
          return next(parseMongoError(error));
        });

      if (!groupConversation) {
        return next(
          new ServerError(
            req.t("modules.chat.group-conversations.update.join.error"),
            "JOIN_GROUP_CONVERSATION_FAIL"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.chat.group-conversations.update.join.success"),
        // data: groupConversation,
      });
    } catch (error) {
      logError("update", "Join group conversation error", error);
      return next(
        new ServerError(
          req.t("modules.chat.group-conversations.update.join.error")
        )
      );
    }
  }

  public async readNewMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    const { groupId } = req.body;

    const missingFields = [];
    if (!groupId) missingFields.push("groupId");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    try {
      const updatedGroup = await groupConversationsService
        .readNewMessages({
          groupId: groupId,
          userId: session.id_user,
        })
        .catch((error) => {
          logError(
            "read-new-messages-group-conversation",
            "Read new messages in group conversation failed",
            error
          );
          return next(parseMongoError(error));
        });

      if (!updatedGroup) {
        return next(
          new ServerError(
            req.t(
              "modules.chat.group-conversations.update.read-new-messages.error"
            ),
            "READ_NEW_MESSAGES_GROUP_CONVERSATION_FAIL"
          )
        );
      }

      return res.status(200).json({
        message: req.t(
          "modules.chat.group-conversations.update.read-new-messages.success"
        ),
        // data: updatedGroup,
      });
    } catch (error) {
      logError(
        "read-new-messages-group-conversation",
        "Read new messages in group conversation error",
        error
      );
      return next(
        new ServerError(
          req.t(
            "modules.chat.group-conversations.update.read-new-messages.error"
          )
        )
      );
    }
  }

  public async leaveGroup(req: Request, res: Response, next: NextFunction) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    const { groupId } = req.body;

    const missingFields = [];
    if (!groupId) missingFields.push("groupId");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }
    try {
      const result = await groupConversationsService
        .leaveGroup({
          groupId: groupId,
          userId: session.id_user,
        })
        .catch((error) => {
          logError(
            "leave-group-conversation",
            "Leave group conversation failed",
            error
          );
          return next(parseMongoError(error));
        });

      if (!result) {
        return next(
          new ServerError(
            req.t("modules.chat.group-conversations.update.leave.error"),
            "LEAVE_GROUP_CONVERSATION_FAIL"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.chat.group-conversations.update.leave.success"),
      });
    } catch (error) {
      logError(
        "leave-group-conversation",
        "Leave group conversation error",
        error
      );
      return next(
        new ServerError(
          req.t("modules.chat.group-conversations.update.leave.error")
        )
      );
    }
  }

  public async updatePermissions(
    req: Request<
      {},
      {},
      {
        groupId: string;
        userId: string;
        permissions: TypePermissionsParticipant;
        role: enumRoleParticipant;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const session = JSON.parse(
      req.headers["session"] as string
    ) as ReqHeaderSession;

    const { groupId, userId, permissions, role } = req.body;

    const missingFields = [];
    if (!groupId) missingFields.push("groupId");
    if (!userId) missingFields.push("userId");
    if (!permissions) missingFields.push("permissions");
    if (!role) missingFields.push("role");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }

    //console.log("req.body", req.body);

    // Kiểm tra xem role có hợp lệ không
    if (!Object.values(enumRoleParticipant).includes(role)) {
      return next(
        new JoiRequestValidationError(
          req.t("validation.invalid-parameter", role),
          "INVALID_ROLE"
        )
      );
    }

    // Kiểm tra xem permissions có hợp lệ không
    //  permissions: {
    //   can_send_messages: 'true',
    //   can_send_media: 'true',
    //   can_send_polls: 'true',
    //   can_change_info: 'true',
    //   can_invite_users: 'true',
    //   can_pin_messages: 'true',
    //   can_delete_messages: 'true',
    //   can_kick_users: 'true',
    //   can_restrict_members: 'true',
    //   can_promote_members: 'true'
    // }
    // Không chấp nhận thiếu tham số permissions
    const validPermissions = Object.values(enumPermissionsParticipant);
    const permissionsKeys = Object.keys(permissions);

    // Kiểm tra thiếu key nào trong permissions
    const missingPermissionKeys = validPermissions.filter(
      (key) => !(key in permissions)
    );
    if (missingPermissionKeys.length > 0) {
      return next(
        new BadRequestError(
          req.t(
            "validation.missing-parameter",
            missingPermissionKeys.join(", ")
          ),
          "MISSING_PERMISSIONS"
        )
      );
    }

    // Kiểm tra permissions có key không hợp lệ không
    const invalidPermissions = permissionsKeys.filter(
      (key) => !validPermissions.includes(key as enumPermissionsParticipant)
    );
    if (invalidPermissions.length > 0) {
      return next(
        new JoiRequestValidationError(
          req.t("validation.invalid-parameter", invalidPermissions.join(", ")),
          "INVALID_PERMISSIONS"
        )
      );
    }

    try {
      const updatedGroup = await groupConversationsService
        .updatePermissionsParticipant({
          groupId: groupId,
          userId: userId,
          role: role,
          permissions: permissions,
          // adminId: session.id_user,
        })
        .catch((error) => {
          logError(
            "update-permissions-group-conversation",
            "Update permissions in group conversation failed",
            error
          );
          return next(
            parseMongoError(
              error,
              req.t("modules.chat.group-conversations.update.permissions.error")
            )
          );
        });

      if (!updatedGroup) {
        return next(
          new ServerError(
            req.t("modules.chat.group-conversations.update.permissions.error"),
            "UPDATE_PERMISSIONS_GROUP_CONVERSATION_FAIL"
          )
        );
      }

      return res.status(200).json({
        message: req.t(
          "modules.chat.group-conversations.update.permissions.success"
        ),
        // data: updatedGroup,
      });
    } catch (error) {
      logError(
        "update-permissions-group-conversation",
        "Update permissions in group conversation error",
        error
      );
      return next(
        new ServerError(
          req.t("modules.chat.group-conversations.update.permissions.error")
        )
      );
    }
  }

  public async updateInfoGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { groupId, title, description, avatar, topics } = req.body;

    // Kiểm tra các tham số bắt buộc
    const missingFields = [];
    if (!groupId) missingFields.push("groupId");
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }

    try {
      // Chỉ truyền những field không rỗng
      const updateData: Record<string, any> = {};
      if (title !== undefined && title !== null && title !== "")
        updateData.title = title;
      if (
        description !== undefined &&
        description !== null &&
        description !== ""
      )
        updateData.description = description;
      if (avatar !== undefined && avatar !== null && avatar !== "")
        updateData.avatar = avatar;
      if (topics !== undefined && topics !== null && topics !== "")
        updateData.topics = topics;

      const updatedGroup = await groupConversationsService
        .updateInfoGroup(groupId, {
          ...updateData,
        })
        .catch((error) => {
          logError(
            "update-info-group-conversation",
            "Update info in group conversation failed",
            error
          );
          return next(
            parseMongoError(
              error,
              req.t("modules.chat.group-conversations.update.info.error")
            )
          );
        });

      if (!updatedGroup) {
        return next(
          new ServerError(
            req.t("modules.chat.group-conversations.update.info.error"),
            "UPDATE_INFO_GROUP_CONVERSATION_FAIL"
          )
        );
      }

      return res.status(200).json({
        message: req.t("modules.chat.group-conversations.update.info.success"),
       // data: updatedGroup,
      });
    } catch (error) {
      logError(
        "update-info-group-conversation",
        "Update info in group conversation error",
        error
      );
      return next(
        new ServerError(
          req.t("modules.chat.group-conversations.update.info.error")
        )
      );
    }
  }
}
