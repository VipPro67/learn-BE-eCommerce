"use strict";
const myLogger = require("../loggers/myLoger");


const StatusCode = {
  FOBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNAUTHORIZED: 401,
  FOBIDDEN: 403,
};

const ReasonStatusCode = {
  FOBIDDEN: "Forbidden error",
  NOT_FOUND: "Not Found",
  CONFLICT: "Conflict error",
  UNAUTHORIZED: "Unauthorized",
  FOBIDDEN: "Forbidden error",
};

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    myLogger.error(message, {
      context : '/path',
      requestId: '1234',
      message: message,
      metadata: { statusCode },
    });
  }
}
class ConflicRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.BAD_REQUEST,
    statusCode = StatusCode.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOT_FOUND,
    statusCode = StatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ErrorResponse,
  ConflicRequestError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
};
