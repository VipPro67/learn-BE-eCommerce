"use strict";
const NotificationService = require("../services/notification.service");
const { OK, Created } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class NotificationController {
  static async pushNotiToSystem(req, res) {
    const { title, content, type } = req.body;
    if (!title || !content || !type) {
      throw new BadRequestError("Error: Missing required fields");
    }
    const result = await NotificationService.pushNotiToSystem({
      title,
      content,
      type,
    });
    new Created("Push notification success", result).send(res);
  }

  static async getNotificationByUserId(req, res) {
    // const { userId, type } = req.query;
    // if (!userId) {
    //   throw new BadRequestError("Error: Missing required fields");
    // }
    // const result = await NotificationService.getNotificationByUserId({
    //   userId,
    //   type,
    // });
    const result = await NotificationService.getNotificationByUserId({
        type: req.query.type,
    });
    new OK("Get notification success", result).send(res);
  }
}

module.exports = NotificationController;
