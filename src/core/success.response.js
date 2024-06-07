"use strict";

const { json } = require("express");

const StatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const ReasonStatusCode = {
  OK: "OK",
  CREATED: "Created",
  NO_CONTENT: "No Content",
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  CONFLICT: "Conflict",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
};

class SuccessResponse {
  constructor(
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {}
  ) {
    this.message = message ? message : reasonStatusCode;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor(message, metadata = {}) {
    super(message, metadata);
  }
}

class Created extends SuccessResponse {
  constructor(
    message = ReasonStatusCode.CREATED,
    metadata = {},
    code = StatusCode.CREATED
  ) {
    super(message, code, ReasonStatusCode.CREATED, metadata);
  }
}

class NoContent extends SuccessResponse {
  constructor(message = ReasonStatusCode.NO_CONTENT, metadata = {}) {
    super(
      message,
      StatusCode.NO_CONTENT,
      ReasonStatusCode.NO_CONTENT,
      metadata
    );
  }
}

module.exports = {
  SuccessResponse,
  OK,
  Created,
  NoContent,
};
