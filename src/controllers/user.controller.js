"use strict";
const { OK } = require("../core/success.response");
const { newUserService, checkLoginEmailTokenService } = require("../services/user.service");

class UserController {
  newUser = async (req, res, next) => {
    const respond = await newUserService({
      email: req.body.email,
    });
    new OK(respond).send(res);
  };

  checkLoginEmailToken = async (req, res, nest) => {
    const { token = null } = req.query;
    const respond = await checkLoginEmailTokenService({
      token,
    });
    new OK(respond).send(res);
  };
}

module.exports = new UserController();
