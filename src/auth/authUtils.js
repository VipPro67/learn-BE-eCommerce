"use strict";
const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIEND_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, privateKey, {
      expiresIn: "1d",
      algorithm: "RS256",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "14d",
      algorithm: "RS256",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) console.log("Error verify :" + err);
      else console.log("Decode verify :", decode);
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error create token pair", error);
    return error;
  }
};

const authenticateToken = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIEND_ID];
  if (!userId) {
    throw new UnauthorizedError("Error: User id missing");
  }

  const keyStore = await KeyTokenService.getKeyTokenByUserId({
    userId: userId,
  });

  if (!keyStore) {
    throw new NotFoundError("Error: Key token not found");
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedError("Error: Access token missing");
  }

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId == decodeUser.userId) {
      throw new UnauthorizedError("Error: UserId invalid");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new UnauthorizedError("Error: Access token invalid");
    } else {
      throw error;
    }
  }
});

module.exports = { createTokenPair, authenticateToken };
