"use strict";

const { token } = require("morgan");
const keyTokenModel = require("../models/keyToken.model");
const { BadRequestError } = require("../core/error.response");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    user,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: user._id },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      throw new BadRequestError("Error: Create key token failed");
    }
  };

  static getKeyTokenByUserId = async ({ userId }) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
  };

  static removeKeyById = async ({ id }) => {
    return await keyTokenModel.deleteOne(id);
  };
}

module.exports = KeyTokenService;
