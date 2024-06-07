"use strict";

const StatusCode = {
  FOBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  FOBIDDEN: "Forbidden error",
  NOT_FOUND: "Not Found",
  CONFLICT: "Conflict error",
};

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
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

module.exports = {
  ErrorResponse,
  ConflicRequestError,
  BadRequestError,
};
