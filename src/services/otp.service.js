
"use strict";
import { randomInt } from "crypto";
import otpModel from "../models/otp.model";

const _generatorTokenRandom = () => {
  const token = randomInt(0, Math.pow(2, 32));
  return token;
};

const newOtp = async (email) => {
  const token = _generatorTokenRandom();
  const newToken = await otpModel.create({
    otp_token: token,
    otp_email: email,
  });

  return newToken;
};

const checkEmailToken = async ({ token }) => {
  const hasToken = await otpModel.findOne({ otp_token: token });
  if (!hasToken) throw new Error("Token not found");
  // delete token from model
  otpModel.deleteOne({ otp_token: token }).then();
  return hasToken;
};
export { newOtp, checkEmailToken };
