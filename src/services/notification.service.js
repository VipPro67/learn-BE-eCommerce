"use strict";
const { BadRequestError } = require("../core/error.response");
const { notification } = require("../models/notification.model");
const { all } = require("../routes");
const { convertToObjectId } = require("../utils");

class NotificationService {
  static async pushNotiToSystem({ type, senderId, receiverId, options = {} }) {
    let noti = new notification();
    switch (type) {
      case "ORDER":
        noti.noti_content = senderId + " đã đặt hàng " + options.orderId;
        break;
      case "MESSAGE":
        noti.noti_content = senderId + " đã gửi tin nhắn ";
        break;
      case "PROMOTION":
        noti.noti_content =
          senderId + " đã tạo khuyến mãi " + options.promotionName;
        break;
      case "PRODUCT":
        noti.noti_content =
          senderId + " đã tạo sản phẩm " + options.productName;
        break;
      default:
        throw new BadRequestError("Error: Invalid notification type", type);
    }
    noti.noti_type = type;
    noti.noti_senderId = convertToObjectId(senderId);
    noti.noti_receiverId = receiverId;
    noti.noti_options = options;
    return await noti.save();
  }

  static async getNotificationByUserId({ userId = 1, type }) {
    return await notification.aggregate([
      {
        $match: {
          noti_receiverId: userId,
          noti_type: type === "ALL" ? { $ne: null } : type,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
  }
}

module.exports = NotificationService;
