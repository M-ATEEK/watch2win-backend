"use strict";
var acl = require("acl");

acl = new acl(new acl.memoryBackend());

acl.allow([
  {
    roles: ["admin", "inspector", "manager"],
    allows: [
      {
        resources: ["/admin/sentences"],
        permissions: ["get"]
      },
      {
        resources: "/admin/sentences/:id",
        permissions: ["post", "get", "delete"]
      }
    ]
  }
]);

exports.isAllowed = require("./isAllowed")(acl);
