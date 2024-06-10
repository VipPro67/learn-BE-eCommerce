"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../untils");
const { BadRequestError } = require("../core/error.response");
const { findShopByEmail } = require("./shop.service");

const ROLESHOP = {
  SHOP: "0000",
  WRITER: "0001",
  EDITOR: "0002",
  ADMIN: "0003",
};

class AccessService {
  static login = async ({ email, password, refeshtoken = null }) => {
    const foundShop = await findShopByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Error: Email not found, Shop not registered");
    }
    const comparePassword = await bcrypt.compare(password, foundShop.password);
    if (!comparePassword) {
      throw new BadRequestError("Error: Password not match");
    }

    const privateKey = crypto.randomBytes(64).toString("hex");

    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { shopId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      publicKey: publicKey,
      privateKey: privateKey,
      user: foundShop,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

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
          refreshToken: null,
        });

        const tokens = await createTokenPair(
          { userId: newShop._id, email: newShop.email },
          publicKey,
          privateKey
        );
        return {
          message: "Success: Sign up success!",
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
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
