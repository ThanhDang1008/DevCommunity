import express, { Router } from "express";

import { CreateGroupConversations } from "../controllers/GroupConversations/create";
import { GetGroupConversations } from "../controllers/GroupConversations/get";
import { UpdateGroupConversations } from "../controllers/GroupConversations/update";
import { ValidateCreateGroupConversation } from "../validator/GroupConversations/create";

import { CreateGroupMessages } from "../controllers/GroupMessages/create";
import { GetGroupMessages } from "../controllers/GroupMessages/get";
import { UpdateGroupMessages } from "../controllers/GroupMessages/update";
import { DeleteGroupMessages } from "../controllers/GroupMessages/delete";

import { CreateGroupJoinRequests } from "../controllers/GroupJoinRequests/create";
import { UpdateGroupJoinRequests } from "../controllers/GroupJoinRequests/update";
import { GetGroupJoinRequests } from "../controllers/GroupJoinRequests/get";
import { ValidateCreateGroupJoinRequests } from "../validator/GroupJoinRequests/create";
import { ValidateUpdateGroupJoinRequests } from "../validator/GroupJoinRequests/update";
import { ValidateGetGroupJoinRequests } from "../validator/GroupJoinRequests/get";

import { masterAuthMiddleware } from "@/shared/middleware/master.middleware";
import { authAuthMiddleware } from "@/shared/middleware/auth.middleware";
import { Role } from "@/constants/common";
import { verifySignature } from "@/shared/middleware/verifySignature.middleware";

class ChatRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/chat", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    //----------- Group Conversations Routes -----------
    this.router.get(
      "/group-conversations/:groupId",
      authAuthMiddleware(Object.values(Role)),
      GetGroupConversations.prototype.getById
    );
    this.router.post(
      "/group-conversations",
      verifySignature(),
      authAuthMiddleware(Object.values(Role)),
      ValidateCreateGroupConversation.prototype.handle,
      CreateGroupConversations.prototype.handle
    );
    this.router.get(
      "/group-conversations",
      authAuthMiddleware(Object.values(Role)),
      GetGroupConversations.prototype.handle
    );
    this.router.post(
      "/group-conversations/all",
      GetGroupConversations.prototype.getAll
    );
    this.router.patch(
      "/group-conversations/join",
      authAuthMiddleware(Object.values(Role)),
      UpdateGroupConversations.prototype.joinGroupPublic
    );
    this.router.patch(
      "/group-conversations/read-new-messages",
      authAuthMiddleware(Object.values(Role)),
      UpdateGroupConversations.prototype.readNewMessages
    );
    this.router.patch(
      "/group-conversations/leave",
      authAuthMiddleware(Object.values(Role)),
      UpdateGroupConversations.prototype.leaveGroup
    );
    this.router.patch(
      "/group-conversations/update-permissions",
      authAuthMiddleware(Object.values(Role)),
      UpdateGroupConversations.prototype.updatePermissions
    );
    this.router.patch(
      "/group-conversations/update-info",
      authAuthMiddleware(Object.values(Role)),
      UpdateGroupConversations.prototype.updateInfoGroup
    );

    //----------- Group Messages Routes -----------
    this.router.post(
      "/group-messages",
      verifySignature(),
      authAuthMiddleware(Object.values(Role)),
      CreateGroupMessages.prototype.send
    );
    this.router.patch(
      "/group-messages/read-by-user",
      authAuthMiddleware(Object.values(Role)),
      UpdateGroupMessages.prototype.readByUser
    );
    this.router.get(
      "/group-messages/:groupId",
      authAuthMiddleware(Object.values(Role)),
      GetGroupMessages.prototype.handle
    );
    this.router.delete(
      "/group-messages",
      authAuthMiddleware(Object.values(Role)),
      DeleteGroupMessages.prototype.deleteMessage
    );
    //----------- Group Join Requests Routes -----------
    this.router.post(
      "/group-join-requests",
      authAuthMiddleware(Object.values(Role)),
      ValidateCreateGroupJoinRequests.prototype.join,
      CreateGroupJoinRequests.prototype.join
    );
    this.router.patch(
      "/group-join-requests/feedback",
      authAuthMiddleware(Object.values(Role)),
      ValidateUpdateGroupJoinRequests.prototype.feedback,
      UpdateGroupJoinRequests.prototype.feedback
    );
    this.router.get(
      "/group-join-requests/:groupId",
      authAuthMiddleware(Object.values(Role)),
      ValidateGetGroupJoinRequests.prototype.getAll,
      GetGroupJoinRequests.prototype.getAll
    );

    return this.router;
  }
}

export const chatRoutes: ChatRoutes = new ChatRoutes();
