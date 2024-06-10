"use strict";

const AccessService = require("../services/access.service");

const { Created, OK } = require("../core/success.response");

class AccessController {
  async signUp(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await AccessService.signUp({ name, email, password });
      return new Created(result.message, result.metadata).send(res);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AccessService.login({ email, password });
      console.log(result);
      return new OK('Login Success', result).send(res);
    } catch (error) {
      next(error);
    }
  }

}
module.exports = new AccessController();
