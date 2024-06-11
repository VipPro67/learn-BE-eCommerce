"use strict";

const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing API key." });
    }

    const objKey = await findById(key);

    if (!objKey) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid API key." });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey || !req.objKey.permissions) {
      // Check if objKey exists
      return res
        .status(403)
        .json({ message: "Permission Denied: No permissions found." });
    }

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({ message: "Permission Denied" });
    }

    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = { apiKey, permission, asyncHandler };
