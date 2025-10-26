"use strict";
var acl = require("acl");

acl = new acl(new acl.memoryBackend());

acl.allow([
  {
    roles: ["admin"],
    allows: [
      {
        resources: ["/admin/users", "/admin/validate-token"],
        permissions: ["get", "post"]
      },
      {
        resources: "/admin/users/:id",
        permissions: ["put", "get", "delete"]
      }
    ]
  },
  // Allow admin/validate-token to managers and inspectors too
  {
    roles: ["manager", "inspector", "client", "contact"],
    allows: [
      {
        resources: ["/admin/validate-token"],
        permissions: ["post", "get"]
      }
    ]
  },
  {
    roles: ["manager","admin"],
    allows: [
      {
        resources: [
          "/admin/users",
          "/admin/users/:id",
          "/admin/users/search",
          "/admin/searchUsers"
        ],
        permissions: ["get", "post", "put", "delete"]
      },
      {
        resources: ["/update-users/:id"],
        permissions: ["put"]
      },
      {
        resources: [
          "/admin/docusignAccessToken",
          "/admin/share_document/:job_id"
        ],
        permissions: ["post"]
      }
    ]
  },
  {
    roles: ["admin"],
    allows: [
      {
        resources: ["/admin/users", "/admin/validate-token"],
        permissions: ["get", "post"]
      },
      {
        resources: "/admin/users/:id",
        permissions: ["put", "get", "delete"]
      }
    ]
  },
  {
    roles: ["manager", "inspector", "client", "contact"],
    allows: [
      {
        resources: ["/admin/validate-token"],
        permissions: ["post", "get"]
      }
    ]
  },
  {
    roles: ["manager", "inspector", "admin", "client", "contact"],
    allows: [
      {
        resources: ["/users/:id", "/user", "/admin/download_pdf_report"],
        permissions: ["put", "get", "post"]
      }
    ]
  },
  {
    roles: ["manager", "admin"],
    allows: [
      {
        resources: ["/users"],
        permissions: ["get"]
      }
    ]
  }
]);

exports.isAllowed = require("./isAllowed")(acl);
