"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ForbiddenError } = require("../core/error.response");
const { findShopByEmail } = require("./shop.service");
const keyTokenModel = require("../models/keyToken.model");

const ROLESHOP = {
  SHOP: "0000",
  WRITER: "0001",
  EDITOR: "0002",
  ADMIN: "0003",
};

class AccessService {
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findKeyByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      const { userId, email } = verifyJWT(refreshToken, foundToken.publicKey);

      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError(
        "Error: Refresh token used, please login again!"
      );
    }

    const holderToken = await KeyTokenService.findKeyByRefreshToken(
      refreshToken
    );
    if (!holderToken) {
      throw new ForbiddenError("Error: Refresh token not found");
    }
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.publicKey
    );

    const foundShop = await findShopByEmail({ email });
    if (!foundShop) {
      throw new ForbiddenError("Error: Shop not found");
    }

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    await KeyTokenService.addRefreshTokenUsed({
      refreshToken,
      publicKey: holderToken.publicKey,
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
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        });

        let privateKeyString = privateKey.toString("base64");
        let publicKeyString = publicKey.toString("base64");

        const tokens = await createTokenPair(
          { userId: newShop._id, email: newShop.email },
          publicKeyString,
          privateKeyString
        );
        const keyStore = await KeyTokenService.createKeyToken({
          user: newShop._id,
          privateKey: privateKeyString,
          publicKey: publicKeyString,
          refreshToken: tokens.refreshToken,
        });
        if (!keyStore) {
          throw new BadRequestError("Error: Key token not created");
        }
        return {
          message: "Success: Sign up success!",
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens: tokens,
          },
        };
      }
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  };
  static login = async ({ email, password, refeshtoken = null }) => {
    const foundShop = await findShopByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Error: Email not found, Shop not registered");
    }
    const comparePassword = await bcrypt.compare(password, foundShop.password);
    if (!comparePassword) {
      throw new BadRequestError("Error: Password not match");
    }

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    let privateKeyString = privateKey.toString("base64");
    let publicKeyString = publicKey.toString("base64");

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKeyString,
      privateKeyString
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      publicKey: publicKeyString,
      privateKey: privateKeyString,
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

  static logout = async ({ keyStore }) => {
    return await KeyTokenService.removeKeyById({ id: keyStore._id });
  };
}

module.exports = AccessService;
