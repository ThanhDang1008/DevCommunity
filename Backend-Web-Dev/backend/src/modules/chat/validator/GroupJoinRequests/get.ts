import { Request, Response, NextFunction } from "express";
import { JoiRequestValidationError } from "@/shared/globals/exceptions/error-handler";

export class ValidateGetGroupJoinRequests {
  public getAll(
    req: Request<{
      groupId: string;
    }>,
    res: Response,
    next: NextFunction
  ) {
    const { groupId } = req.params;
    const missingFields = [];
    if (!groupId) missingFields.push("groupId");

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
