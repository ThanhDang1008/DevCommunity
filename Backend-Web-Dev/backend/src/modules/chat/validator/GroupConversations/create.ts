import { Request, Response, NextFunction } from "express";
import { JoiRequestValidationError } from "@/shared/globals/exceptions/error-handler";

export class ValidateCreateGroupConversation {
  public handle(req: Request, Response: Response, next: NextFunction) {
    const { title, members, topics } = req.body;

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      missingFields.push("topics");
    }
    if (!members || !Array.isArray(members) || members.length === 0) {
      missingFields.push("members");
    } else {
      members.forEach((member: any, index: number) => {
        if (!member.userId) {
          missingFields.push(`members[${index}].userId`);
        }
      });
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
