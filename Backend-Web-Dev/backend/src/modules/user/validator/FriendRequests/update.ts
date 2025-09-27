import { Request, Response, NextFunction } from "express";
import { JoiRequestValidationError } from "@/shared/globals/exceptions/error-handler";
import { EnumFriendRequestStatus } from "../../schemes/FriendRequests.model";

export class ValidateUpdateFriendRequests {
  public feedback(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      {
        status: EnumFriendRequestStatus;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const { friendRequestId } = req.params;
    const { status } = req.body;

    const missingFields = [];
    if (!status) missingFields.push("status");
    if (!friendRequestId) missingFields.push("friendRequestId");
    else if (typeof friendRequestId !== "string") {
      missingFields.push("friendRequestId (must be a string)");
    }
    if (status && !Object.values(EnumFriendRequestStatus).includes(status)) {
      missingFields.push(
        "status (must be one of 'PENDING', 'ACCEPTED', 'REJECTED')"
      );
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

  public cancel(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response,
    next: NextFunction
  ) {
    const { friendRequestId } = req.params;

    if (!friendRequestId) {
      return next(
        new JoiRequestValidationError(
          req.t("validation.missing-parameter", "friendRequestId"),
          "MISSING_FRIEND_REQUEST_ID"
        )
      );
    }

    next();
  }
}
