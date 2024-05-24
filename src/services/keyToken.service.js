"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ user, publicKey,privateKey }) => {
    try {
      // const publicKeyString = publicKey.toString();
      const newKeyToken = await keyTokenModel.create({
        user: user,
        publicKey: publicKey,
        privateKey: privateKey,
      });
      newKeyToken.save();
      return newKeyToken ? newKeyToken.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
