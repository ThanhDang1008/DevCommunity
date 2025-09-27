import { Request, Response, NextFunction } from "express";
import { JoiRequestValidationError } from "@/shared/globals/exceptions/error-handler";
import type { TypeReviewStatus } from "@modules/chat/schemes/GroupJoinRequests.model";

export class ValidateUpdateGroupJoinRequests {
  public feedback(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      {
        groupJoinRequestId: string;
        groupId: string;
        action: TypeReviewStatus;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const { groupJoinRequestId, action,groupId } = req.body;

    const missingFields = [];
    if (!groupJoinRequestId) missingFields.push("groupJoinRequestId");
    if (!action) missingFields.push("action");
    if (!groupId) missingFields.push("groupId");
    else if (action !== "APPROVED" && action !== "REJECTED") {
      missingFields.push("action (must be 'APPROVED' or 'REJECTED')");
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
