"use strict";
import { createTokenPair } from "../auth/authUtils";
import CustomError from "../core/custom.error";
import { BadRequestError, ErrorResponse } from "../core/error.response";
import { SuccessResponse } from "../core/success.response";
import createUser from "../models/repositories/user.repo";
import shopModel from "../models/shop.model";
import userModel from "../models/user.model";
import { getInfoData } from "../utils";
import emailService from "./email.service.js";
import KeyTokenService from "./keyToken.service";
import { checkEmailToken } from "./otp.service";
import bcrypt from "bcrypt";
const newUserService = async ({ email = null, captcha = null }) => {
  const user = await userModel.findOne({ email }).lean();
  if (user) {
    return new CustomError("Email already exists", 409);
  }
  const result = await emailService.sendEmailToken({ email });
  console.log(result);

  return {
    message: "verify email user",
    metadata: { token: result },
  };
};

const checkLoginEmailTokenService = async (tokenInput) => {
  try {
    const { otp_email: email, otp_token: token } = await checkEmailToken({
      token: tokenInput,
    });
    if (!email) throw new ErrorResponse(`Token not found`);
    const hasUser = await _findUserByEmailWithLogin(email);
    if (hasUser) throw new ErrorResponse(`Email already exists`);
    const passwordHash = await bcrypt.hash(email, 1);

    const newUser = await createUser({
      usr_id: 1,
      usr_slug: "a",
      usr_name: email,
      usr_role: "",
      usr_password: passwordHash,
    });
    if (newUser) {
      const publicKey = bcrypt.randomBytes(64).toString("hex");
      const privateKey = bcrypt.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser.usr_id,
        publicKey,
        privateKey,
      });
      if (!keyStore) throw new BadRequestError("Error: PublicKey error");

      const tokens = await createTokenPair(
        { userId: newUser.usr_id, email },
        publicKey,
        privateKey
      );
      console.log(`create token success::`, tokens);
      return {
        code: 201,
        message: "verify successfully",
        metadata: {
          user: getInfoData({
            fields: ["usr_id", "usr_name", "usr_email"],
            object: newUser,
          }),
          tokens,
        },
      };
    }
  } catch (error) {
    console.error(``);
  }
};
const _findUserByEmailWithLogin = async (email) => {
  const user = await userModel.findOne({ usr_email: email }).lean();
  return user;
};
export { newUserService, checkLoginEmailTokenService };
