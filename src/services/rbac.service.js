"use strict";

const { resource } = require("../models/resource.model");
const { role } = require("../models/role.model");

/**
 *
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */

const createResource = async ({ name, slug, description }) => {
  try {
    console.log("createResource", name, slug, description);
    const newResource = await resource.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });
    return newResource;
  } catch (error) {
    console.log(error);
  }
};

const resourceList = async ({
  userId,
  limit = 10,
  offset = 0,
  search = "",
}) => {
  try {
    // check admin midderware

    const resources = await resource
      .aggregate([
        {
          $project: {
            _id: 0,
            id: "$src_name",
            name: "$src_name",
            slug: "$src_slug",
            description: "$src_description",
            resourceId: "$_id",
            createdAt: 1,
          },
        },
      ])
      .skip(offset)
      .limit(limit);
  } catch (error) {
    return [];
  }
};

const createRole = async ({
  name = "shop",
  slug = "s00001",
  description = "extend from shop or user",
  grants = [],
}) => {
  try {
    console.log("createRole", name, slug, description, grants);
    const nrole = await role.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grants: grants,
    });

    return nrole;
  } catch (error) {
    console.log(error);
  }
};

const roleList = async ({ userId, limit = 10, offset = 0, search = "" }) => {
  const roles = await role.aggregate([
    {
      $unwind: "$rol_grants",
    },
    {
      $lookup: {
        from: "Resources",
        localField: "rol_grants.resource",
        foreignField: "_id",
        as: "resource",
      },
    },
    {
      $unwind: "$resource",
    },
    {
      $project: {
        role: "$rol_name",
        resource: "$resource.src_name",
        action: "$rol_grants.actions",
        attributes: "$rol_grants.attributes",
      },
    },
    {
      $unwind: "$action",
    },
    {
      $project: {
        _id: 0,
        role: 1,
        resource: 1,
        action: 1,
        attributes: 1,
      },
    },
  ]);

  return roles;
};

module.exports = {
  createResource,
  resourceList,
  createRole,
  roleList,
};
