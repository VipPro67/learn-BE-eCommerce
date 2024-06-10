"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, privateKey, {
      expiresIn: "1d",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "14d",
    });
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) console.log("Error verify :" + err);
      else console.log("Decode verify :", decode);
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = { createTokenPair };
