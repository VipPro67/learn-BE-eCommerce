const { Created, OK } = require("../core/success.response");

const {
  createResource,
  resourceList,
  createRole,
  roleList,
} = require("../services/rbac.service");

async function newRole(req, res, next) {
  try {
    const newRole = await createRole(req.body);
    res.status(201).json(
      new Created({
        message: "Role created successfully",
        metadata: newRole,
      })
    );
  } catch (error) {
    next(error);
  }
}

async function newResource(req, res, next) {
  try {
    const newResource = await createResource(req.body);
    res.status(201).json(
      new Created({
        message: "Resource created successfully",
        metadata: newResource,
      })
    );
  } catch (error) {
    next(error);
  }
}

async function listRoles(req, res, next) {
  try {
    const roles = await roleList(req.query);
    res.json(
      new OK({
        message: "Roles retrieved successfully",
        metadata: roles,
      })
    );
  } catch (error) {
    next(error);
  }
}

async function listResources(req, res, next) {
  try {
    const resources = await resourceList(req.query);
    res.json(
      new OK({
        message: "Resources retrieved successfully",
        metadata: resources,
      })
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  newRole,
  newResource,
  listRoles,
  listResources,
};
