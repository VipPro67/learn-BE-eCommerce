"use strict";
const { OK } = require("../core/success.response");
const { use } = require("../routes");

const profiles = [
  {
    usr_id: 1,
    usr_name: "CR7",
    usr_avt: "image.com/user/1",
  },
  {
    usr_id: 2,
    usr_name: "Mlø",
    usr_avt: "image.com/user/2",
  },
  {
    usr_id: 3,
    usr_name: "TIPJS",
    usr_avt: "image.com/user/3",
  },
];

class ProfileController {
  // Admin view all profiles
  async profiles(req, res, next) {
    new OK({
      message: "View all profiles",
      metadata: profiles,
    }).send(res);
  }

  // Shop view own profile
  async profile(req, res, next) {

    const user_id = req.keyStore.userId;
    console.log(user_id);
    const profile = profiles.find((profile) => profile.usr_id === user_id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    new OK({
      message: "View own profile",
      metadata: profile,
    }).send(res);
  }
}

module.exports = new ProfileController();
