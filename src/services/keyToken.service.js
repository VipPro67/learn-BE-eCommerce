"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ user, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const newKeyToken = await keyTokenModel.create({
        user: user,
        publicKey: publicKeyString,
      });
      newKeyToken.save();
      return newKeyToken ? newKeyToken.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
