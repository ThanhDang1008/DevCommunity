import { Request, Response, NextFunction } from "express";
import { JoiRequestValidationError } from "@/shared/globals/exceptions/error-handler";

export class ValidateCreateFriendRequests {
  public create(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      {
        friendId: string;
        requestMessage?: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const { friendId, requestMessage } = req.body;

    const missingFields = [];
    if (!friendId) missingFields.push("friendId");

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
