"use strict";
var acl = require("acl");

acl = new acl(new acl.memoryBackend());

acl.allow([
  {
    roles: ["admin", "manager", "inspector"],
    allows: [
      {
        resources: ["/admin/languages"],
        permissions: ["get"]
      },
      {
        resources: "/admin/languages/:id",
        permissions: ["post", "get", "delete"]
      }
    ]
  }
]);

exports.isAllowed = require("./isAllowed")(acl);
