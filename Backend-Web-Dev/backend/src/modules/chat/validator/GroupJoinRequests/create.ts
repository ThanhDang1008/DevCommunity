import { Request, Response, NextFunction } from "express";
import { JoiRequestValidationError } from "@/shared/globals/exceptions/error-handler";
import type { TypeRequestType } from "@modules/chat/schemes/GroupJoinRequests.model";

export class ValidateCreateGroupJoinRequests {
  public join(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      {
        groupId: string;
        requestType: TypeRequestType;
        requestMessage?: string;
        invitedBy?: string | null;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const { groupId, requestType, requestMessage, invitedBy } = req.body;
    const missingFields = [];
    if (!groupId) missingFields.push("groupId");
    if (!requestType) missingFields.push("requestType");
    if (requestType === "INVITE" && !invitedBy) {
      missingFields.push("invitedBy");
    } else if (requestType === "INVITE" && !requestMessage) {
      missingFields.push("requestMessage");
    } else if (requestType !== "INVITE" && requestType !== "JOIN") {
      missingFields.push("requestType (must be 'INVITE' or 'REQUEST')");
    }

    if (missingFields.length > 0) {
      return next(
        new JoiRequestValidationError(
          req.t("validation.missing-parameter", missingFields.join(", ")),
          "MISSING_FIELDS"
        )
      );
    }

    next();
  }
}
