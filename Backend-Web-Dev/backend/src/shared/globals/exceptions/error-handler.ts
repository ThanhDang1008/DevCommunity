export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  serializeErrors(): IError;
  stack?: any;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
    };
  }
}
//status 500
export class ServerError extends CustomError {
  statusCode = 500;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "INTERNAL_SERVER_ERROR";
  }
}

//status 400
export class JoiRequestValidationError extends CustomError {
  statusCode = 400;
  status = "error";

  constructor(message: string, status: string) {
    super(message);
    this.status = status || "VALIDATION_ERROR";
  }
}

export class BadRequestError extends CustomError {
  statusCode = 400;
  status: string;

  constructor(message: string, status: string) {
    super(message);
    this.status = status || "BAD_REQUEST";
  }
}

export class NotFoundError extends CustomError {
  statusCode = 404;
  status: string;

  constructor(message: string, status: string) {
    super(message);
    this.status = status || "NOT_FOUND";
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  status: string;

  constructor(message: string, status: string) {
    super(message);
    this.status = status || "NOT_AUTHORIZED";
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = 413;
  status: string;

  constructor(message: string, status: string) {
    super(message);
    this.status = status || "FILE_TOO_LARGE";
  }
}

export class TooManyRequestError extends CustomError {
  statusCode = 429;
  status: string;

  constructor(message: string, status: string) {
    super(message);
    this.status = status || "TOO_MANY_REQUESTS";
  }
}

export class ConflictError extends CustomError {
  statusCode = 409;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "CONFLICT";
  }
}

export class ForbiddenError extends CustomError {
  statusCode = 403;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "FORBIDDEN";
  }
}

export class UnprocessableEntityError extends CustomError {
  statusCode = 422;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "UNPROCESSABLE_ENTITY";
  }
}

// 402 Payment Required (hiếm dùng, nhưng hợp lệ)
export class PaymentRequiredError extends CustomError {
  statusCode = 402;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "PAYMENT_REQUIRED";
  }
}

// 405 Method Not Allowed
export class MethodNotAllowedError extends CustomError {
  statusCode = 405;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "METHOD_NOT_ALLOWED";
  }
}

// 406 Not Acceptable
export class NotAcceptableError extends CustomError {
  statusCode = 406;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "NOT_ACCEPTABLE";
  }
}

// 407 Proxy Authentication Required
export class ProxyAuthRequiredError extends CustomError {
  statusCode = 407;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "PROXY_AUTH_REQUIRED";
  }
}

// 408 Request Timeout
export class RequestTimeoutError extends CustomError {
  statusCode = 408;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "REQUEST_TIMEOUT";
  }
}

// 410 Gone
export class GoneError extends CustomError {
  statusCode = 410;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "GONE";
  }
}

// 411 Length Required
export class LengthRequiredError extends CustomError {
  statusCode = 411;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "LENGTH_REQUIRED";
  }
}

// 412 Precondition Failed
export class PreconditionFailedError extends CustomError {
  statusCode = 412;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "PRECONDITION_FAILED";
  }
}

// 414 URI Too Long
export class UriTooLongError extends CustomError {
  statusCode = 414;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "URI_TOO_LONG";
  }
}

// 415 Unsupported Media Type
export class UnsupportedMediaTypeError extends CustomError {
  statusCode = 415;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "UNSUPPORTED_MEDIA_TYPE";
  }
}

// 416 Range Not Satisfiable
export class RangeNotSatisfiableError extends CustomError {
  statusCode = 416;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "RANGE_NOT_SATISFIABLE";
  }
}

// 417 Expectation Failed
export class ExpectationFailedError extends CustomError {
  statusCode = 417;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "EXPECTATION_FAILED";
  }
}

// 426 Upgrade Required
export class UpgradeRequiredError extends CustomError {
  statusCode = 426;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "UPGRADE_REQUIRED";
  }
}

// 428 Precondition Required
export class PreconditionRequiredError extends CustomError {
  statusCode = 428;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "PRECONDITION_REQUIRED";
  }
}

// 431 Request Header Fields Too Large
export class RequestHeaderFieldsTooLargeError extends CustomError {
  statusCode = 431;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "REQUEST_HEADER_FIELDS_TOO_LARGE";
  }
}

// 451 Unavailable For Legal Reasons
export class UnavailableForLegalReasonsError extends CustomError {
  statusCode = 451;
  status: string;

  constructor(message: string, status?: string) {
    super(message);
    this.status = status || "UNAVAILABLE_FOR_LEGAL_REASONS";
  }
}
