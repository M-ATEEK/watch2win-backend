const config = require("../config");
const bcrypt = require("bcryptjs");
const User = require("../models/users-model");
const Admin = require("../models/admin-model");

module.exports = {
  hasAdminAccess: (req, res, next) => {
    const { _id } = req.user;
    Admin.findOne({ _id })
      .lean()
      .exec((err, admin) => {
        if (err) {
          // Database connection problems
          res.status(500);
        } else {
          if (admin) {
            if (config.roles.adminRoles.includes(admin.role)) {
              // Save admin data for further use
              req.admin = admin;
              // Has Access of Admin Panel
              next();
            } else {
              // Doesn't have Admin panel access
              res.status(401).send({
                message: "Access Forbidden"
              });
            }
          } else {
            // User doesn't exist
            res.status(401).send({
              message: "Access Forbidden"
            });
          }
        }
      });
  },
  superAdmin: (req, res, next) => {
    // Create a Super Admin by default if one doesn't exist
    Admin.findOne({ email: config.superAdmin.email })
      .lean()
      .exec((err, admin) => {
        if (!admin) {
          let superAdmin = new Admin({
            firstName: "Inventally",
            lastName: "Admin",
            avatar: "default.jpg",
            email: config.superAdmin.email,
            password: bcrypt.hashSync(
              config.superAdmin.password,
              bcrypt.genSaltSync(10)
            ),
            role: "admin"
          });
          superAdmin.save((err, exec) => {
            next();
          });
        } else {
          next();
        }
      });
  }
};
