"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../untils");
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: 409,
          message: "Email already exists",
        };
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: ["shop"],
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
          return {
            code: xxx,
            message: "Error while creating key token",
          };
        }

        const tokens = await createTokenPair(
          { userId: newShop._id, email: newShop.email },
          publicKey,privateKey
        );
        return {
          code: 201,
          message: "Create Shop Success",
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
      return error;
    }
  };
}

module.exports = AccessService;
