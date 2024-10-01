"use strict";
const templateModel = require("../models/template.model");
const newTemplate = async ({ tem_name }) => {
  const newTem = await templateModel.create({
    tem_name, // unique name
    tem_html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: #f4f4f4;
      margin: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      font-size: 24px;
      color: #333;
    }
    p {
      font-size: 16px;
      color: #555;
      line-height: 1.5;
    }
    .otp {
      font-size: 20px;
      font-weight: bold;
      color: #007bff;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #fff;
      background-color: #007bff;
      border-radius: 5px;
      text-decoration: none;
      text-align: center;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .footer {
      font-size: 14px;
      color: #888;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>OTP Verification</h1>
    <p>Hello [User Name],</p>
    <p>Thank you for registering with us. Please use the following One-Time Password (OTP) to complete your verification process:</p>
    <p class="otp">otp</p>
    <p>To confirm your email address, please click the link below:</p>
    <a class="button" href="{{link_verify}}">Confirm Your Email</a>
    <p>The OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
    <p>Best regards,<br>Your Company Team</p>
    <div class="footer">
      <p>If you have any questions or need assistance, feel free to contact our support team.</p>
    </div>
  </div>
</body>
</html>`,
  });
  return newTem;
};

const getTemplate = async (tem_name) => {
  const template = await templateModel.findOne({ tem_name });
  return template;
};

module.exports = {
  newTemplate,
  getTemplate,
};
