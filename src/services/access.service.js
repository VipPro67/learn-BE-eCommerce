"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../untils");
const { BadRequestError } = require("../core/error.response");

const ROLESHOP = {
  SHOP: "0000",
  WRITER: "0001",
  EDITOR: "0002",
  ADMIN: "0003",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestError("Error: Email already registered");
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: ["0000"],
      });

      if (newShop) {
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "spki",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs8",
        //     format: "pem",
        //   },
        // });

        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const keyStore = await KeyTokenService.createKeyToken({
          user: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          throw new BadRequestError("Error: Error when create KeyStore");
        }

        const tokens = await createTokenPair(
          { userId: newShop._id, email: newShop.email },
          publicKey,
          privateKey
        );
        return {
          message: "Success: Sign up success!",
          metadata: {
            shop: getInfoData({
              fileds: ["_id", "name", "email"],
              data: newShop,
            }),
            tokens: tokens,
          },
        };
      }
    } catch (error) {



      throw new BadRequestError(error.message);
    }
  };
}

module.exports = AccessService;
