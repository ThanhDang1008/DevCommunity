import { MongoServerError } from "mongodb";
import { MongooseError } from "mongoose";
import {
  ServerError,
  CustomError,
  BadRequestError,
  ConflictError,
  NotFoundError,
  FileTooLargeError,
  NotAuthorizedError,
  ExpectationFailedError,
  JoiRequestValidationError,
  ForbiddenError,
  LengthRequiredError,
  UriTooLongError,
  MethodNotAllowedError,
  NotAcceptableError,
  PaymentRequiredError,
  PreconditionFailedError,
  PreconditionRequiredError,
  ProxyAuthRequiredError,
  UpgradeRequiredError,
  UnsupportedMediaTypeError,
  RangeNotSatisfiableError,
  UnprocessableEntityError,
  RequestHeaderFieldsTooLargeError,
  RequestTimeoutError,
  TooManyRequestError,
  UnavailableForLegalReasonsError,
  GoneError,
} from "@/shared/globals/exceptions/error-handler";
import i18n from "@/shared/utils/language/i18n";

export function parseMongoError(error: Error, message?: string): CustomError {
  const MESSAGE_ERROR = message || i18n.__("server.error");

  if (error instanceof MongoServerError) {
    switch (error.code) {
      // Duplicate key error
      case 11000:
        return new ConflictError(MESSAGE_ERROR, "MONGO_DUPLICATE_KEY");

      // Validation errors
      case 121:
        return new BadRequestError(
          MESSAGE_ERROR,
          "MONGO_VALIDATION_FAILED"
        );
      case 66:
        return new BadRequestError(
          MESSAGE_ERROR,
          "MONGO_DOCUMENT_VALIDATION_FAILED"
        );

      // Authorization and authentication errors
      case 13:
        return new NotAuthorizedError(
          MESSAGE_ERROR,
          "MONGO_UNAUTHORIZED"
        );
      case 18:
        return new NotAuthorizedError(MESSAGE_ERROR, "MONGO_AUTH_FAILED");
      case 334:
        return new NotAuthorizedError(
          MESSAGE_ERROR,
          "MONGO_SASL_CONVERSATION_ERROR"
        );
      case 276:
        return new ForbiddenError(
          MESSAGE_ERROR,
          "MONGO_CANNOT_CREATE_INDEX"
        );

      // Not found errors
      case 26:
        return new NotFoundError(
          MESSAGE_ERROR,
          "MONGO_NAMESPACE_NOT_FOUND"
        );
      case 73:
        return new NotFoundError(
          MESSAGE_ERROR,
          "MONGO_INVALID_NAMESPACE"
        );
      case 185:
        return new NotFoundError(MESSAGE_ERROR, "MONGO_INDEX_NOT_FOUND");

      // Bad request / Client errors
      case 2:
        return new BadRequestError(MESSAGE_ERROR, "MONGO_BAD_VALUE");
      case 9:
        return new BadRequestError(
          MESSAGE_ERROR,
          "MONGO_FAILED_TO_PARSE"
        );
      case 14:
        return new BadRequestError(MESSAGE_ERROR, "MONGO_TYPE_MISMATCH");
      case 16:
        return new BadRequestError(MESSAGE_ERROR, "MONGO_INVALID_LENGTH");
      case 28:
        return new BadRequestError(
          MESSAGE_ERROR,
          "MONGO_PATH_NOT_VIABLE"
        );
      case 40:
        return new BadRequestError(
          MESSAGE_ERROR,
          "MONGO_CANNOT_CREATE_COLLECTION"
        );
      case 51:
        return new BadRequestError(
          MESSAGE_ERROR,
          "MONGO_COMMAND_NOT_FOUND"
        );
      case 61:
        return new BadRequestError(
          MESSAGE_ERROR,
          "MONGO_SHARD_KEY_NOT_FOUND"
        );
      case 72:
        return new BadRequestError(
          MESSAGE_ERROR,
          "MONGO_INVALID_OPTIONS"
        );
      case 85:
        return new BadRequestError(
          MESSAGE_ERROR,
          "MONGO_INDEX_OPTIONS_CONFLICT"
        );
      case 115:
        return new BadRequestError(
          MESSAGE_ERROR,
          "MONGO_COMMAND_NOT_SUPPORTED"
        );
      case 197:
        return new BadRequestError(
          MESSAGE_ERROR,
          "MONGO_INVALID_INDEX_SPECIFICATION"
        );

      // Timeout errors
      case 50:
        return new RequestTimeoutError(
          MESSAGE_ERROR,
          "MONGO_EXCEEDED_TIME_LIMIT"
        );
      case 216:
        return new RequestTimeoutError(
          MESSAGE_ERROR,
          "MONGO_OPERATION_TIMEOUT"
        );
      case 89:
        return new RequestTimeoutError(
          MESSAGE_ERROR,
          "MONGO_NETWORK_TIMEOUT"
        );

      // Resource limitation errors
      case 16389:
        return new FileTooLargeError(
          MESSAGE_ERROR,
          "MONGO_DOCUMENT_TOO_LARGE"
        );
      case 17280:
        return new TooManyRequestError(
          MESSAGE_ERROR,
          "MONGO_TOO_MANY_LOGICAL_SESSIONS"
        );
      case 16755:
        return new UriTooLongError(
          MESSAGE_ERROR,
          "MONGO_LOCATION_TOO_LONG"
        );
      case 17:
        return new NotAcceptableError(
          MESSAGE_ERROR,
          "MONGO_PROTOCOL_ERROR"
        );

      // Precondition errors
      case 67:
        return new PreconditionFailedError(
          MESSAGE_ERROR,
          "MONGO_CANNOT_SATISFY_WRITE_CONCERN"
        );
      case 10107:
        return new PreconditionFailedError(
          MESSAGE_ERROR,
          "MONGO_NOT_MASTER"
        );
      case 189:
        return new PreconditionRequiredError(
          MESSAGE_ERROR,
          "MONGO_PRIMARY_STEPPED_DOWN"
        );

      // Method not allowed
      case 20:
        return new MethodNotAllowedError(
          MESSAGE_ERROR,
          "MONGO_ILLEGAL_OPERATION"
        );
      case 303:
        return new MethodNotAllowedError(
          MESSAGE_ERROR,
          "MONGO_GRAPH_CONTAINS_CYCLE"
        );

      // Gone errors
      case 136:
        return new GoneError(MESSAGE_ERROR, "MONGO_CURSOR_NOT_FOUND");
      case 43:
        return new GoneError(MESSAGE_ERROR, "MONGO_CURSOR_KILLED");

      // Expectation failed
      case 279:
        return new ExpectationFailedError(
          MESSAGE_ERROR,
          "MONGO_INVALID_UUID"
        );
      case 22:
        return new ExpectationFailedError(
          MESSAGE_ERROR,
          "MONGO_INVALID_BSON"
        );

      // Unprocessable entity
      case 16550:
        return new UnprocessableEntityError(
          MESSAGE_ERROR,
          "MONGO_COMMAND_ON_SHARDED_VIEW_NOT_SUPPORTED"
        );
      case 280:
        return new UnprocessableEntityError(
          MESSAGE_ERROR,
          "MONGO_INVALID_REGEX_OPTIONS"
        );

      // Server errors (5xx equivalent)
      case 1:
        return new ServerError(MESSAGE_ERROR, "MONGO_INTERNAL_ERROR");
      case 8000:
        return new ServerError(MESSAGE_ERROR, "MONGO_AT_CAPACITY");
      case 11600:
        return new ServerError(MESSAGE_ERROR, "MONGO_INTERRUPTED");
      case 11601:
        return new ServerError(
          MESSAGE_ERROR,
          "MONGO_INTERRUPTED_AT_SHUTDOWN"
        );
      case 125:
        return new ServerError(MESSAGE_ERROR, "MONGO_OUT_OF_DISK_SPACE");
      case 14031:
        return new ServerError(
          MESSAGE_ERROR,
          "MONGO_TEMPORARY_UNAVAILABLE"
        );
      case 91:
        return new ServerError(
          MESSAGE_ERROR,
          "MONGO_SHUTDOWN_IN_PROGRESS"
        );
      case 133:
        return new ServerError(
          MESSAGE_ERROR,
          "MONGO_REPLICATION_STATE_TRANSITION"
        );

      // Range not satisfiable
      case 31:
        return new RangeNotSatisfiableError(
          MESSAGE_ERROR,
          "MONGO_RESULT_OUT_OF_RANGE"
        );

      // Upgrade required
      case 142:
        return new UpgradeRequiredError(
          MESSAGE_ERROR,
          "MONGO_INCOMPATIBLE_WITH_UPGRADE_PROTOCOL"
        );

      // Unsupported media type
      case 59:
        return new UnsupportedMediaTypeError(
          MESSAGE_ERROR,
          "MONGO_COMMAND_NOT_SUPPORTED_ON_VIEW"
        );

      // Default case for unknown errors
      default:
        return new ServerError(MESSAGE_ERROR, "MONGO_UNKNOWN_ERROR");
    }
  }

  // Handle MongooseError
  if (error instanceof MongooseError) {
    if (error.name === "ValidationError") {
      return new JoiRequestValidationError(
        MESSAGE_ERROR,
        "MONGOOSE_VALIDATION_ERROR"
      );
    }
    if (error.name === "CastError") {
      return new BadRequestError(MESSAGE_ERROR, "MONGOOSE_CAST_ERROR");
    }
    if (error.name === "DocumentNotFoundError") {
      return new NotFoundError(
        MESSAGE_ERROR,
        "MONGOOSE_DOCUMENT_NOT_FOUND"
      );
    }
    if (error.name === "VersionError") {
      return new ConflictError(MESSAGE_ERROR, "MONGOOSE_VERSION_ERROR");
    }
    if (error.name === "OverwriteModelError") {
      return new ConflictError(
        MESSAGE_ERROR,
        "MONGOOSE_OVERWRITE_MODEL_ERROR"
      );
    }
    if (error.name === "MissingSchemaError") {
      return new BadRequestError(
        MESSAGE_ERROR,
        "MONGOOSE_MISSING_SCHEMA_ERROR"
      );
    }
    if (error.name === "DivergentArrayError") {
      return new BadRequestError(
        MESSAGE_ERROR,
        "MONGOOSE_DIVERGENT_ARRAY_ERROR"
      );
    }
    return new ServerError(MESSAGE_ERROR, "MONGOOSE_UNKNOWN_ERROR");
  }

  // Handle other custom errors
  if (error instanceof CustomError) {
    return error;
  }

  return new ServerError(MESSAGE_ERROR, "PARESE_UNKNOWN_ERROR");
}
