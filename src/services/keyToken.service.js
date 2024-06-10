"use strict";

const { token } = require("morgan");
const keyTokenModel = require("../models/keyToken.model");
const { BadRequestError } = require("../core/error.response");

class KeyTokenService {
  static createKeyToken = async ({
    user,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const publicKeyString = publicKey.toString();
      // const newKeyToken = await keyTokenModel.create({
      //   user: user,
      //   publicKey: publicKey,
      //   privateKey: privateKey,
      // });
      // newKeyToken.save();
      // return newKeyToken ? newKeyToken.publicKey : null;

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
      return tokens ? token.publicKey : null;
    } catch (error) {
      throw new BadRequestError("Error: Create key token failed");
    }
  };
}

module.exports = KeyTokenService;
