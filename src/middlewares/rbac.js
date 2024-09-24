'use strict';
const roleList = require("../services/rbac.service");
const rbac = require("./role.middleware");

/**
 * @param {string} action // read, delete or update
 * @param {*} resource // profile, balance/..
 */
const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(await roleList({ userId: 9999 }));
      const roleName = req.query.role;
      const permission = rbac.can(roleName)[action](resource);
      if (!permission.granted) {
        throw new AuthFailureError("you dont have enough permissions...");
      }
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess,
};
