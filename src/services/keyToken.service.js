"use strict";
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
    return await keyTokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static findKeyByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean();
  };

  static findKeyByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken }).lean();
  };

  static addRefreshTokenUsed = async ({ refreshToken, publicKey }) => {
    return await keyTokenModel.updateOne(
      { refreshToken },
      { $push: { refreshTokenUsed: refreshToken } }
    );
  };

  static removeKeyById = async ({ id }) => {
    return await keyTokenModel.deleteOne(id);
  };

  static deleteKeyByUserId = async (userId) => {
    try {
      const deletedKey = await keyTokenModel.findOneAndDelete({
        user: new Types.ObjectId(userId),
      });
      return deletedKey; // Return the deleted document (or null if not found)
    } catch (error) {
      // Handle errors appropriately, e.g., log the error or throw a custom exception
      console.error("Error deleting key:", error);
      throw error; // Re-throw the error to be handled by a higher-level error handler
    }
  };
}

module.exports = KeyTokenService;
