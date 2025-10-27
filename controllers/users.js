var User = require("../models/users-model.js");
// var Admin = require("../models/admin-model.js"); // Removed in cleanup
const bcrypt = require("bcryptjs");
var jwt = require("jwt-simple");
var emails = require("../services/email");

nodeMailer = require("nodemailer");
// const SubScriber = require("../models/subscriber-model"); // Removed in cleanup
const config = require("../config");
var async = require("async");
const shortid = require("shortid");
// const uniqueString = require("unique-string"); // ES module issue, replaced with crypto
const crypto = require("crypto");
var fs = require("fs");
var mv = require("mv");
var emails = require("../services/email");
const path = require("path");

module.exports = {
  index: function(req, res, next) {
    var _page = parseInt(req.query.page) || 1;
    var _limit = parseInt(req.query.limit) || 1000;
    var query = {};
    var sortBy = {};
    if (req.query.role != "undefined" && req.query.role) {
      query["roles"] = req.query.role;
    }
    if (
      req.query.position &&
      req.query.position != "undefined" &&
      req.query.position &&
      ["business", "landlord", "tenant", "all"].includes(req.query.position) ==
        false
    ) {
      return res.send({
        success: false,
        total: 0,
        page: _page,
        data: {
          users: []
        }
      });
    } else if (
      req.query.position &&
      req.query.position != "undefined" &&
      req.query.position != "all"
    ) {
      query.position = req.query.position;
    }

    if (
      req.query.name &&
      req.query.name != "undefined" &&
      req.query.name != ""
    ) {
      query["firstName"] = { $regex: new RegExp(`${req.query.name}.*`, "i") };
    }

    if (
      req.query.city &&
      req.query.city != "undefined" &&
      req.query.city != "" &&
      req.query.city != "all"
    ) {
      query["city"] = req.query.city;
    }

    if (
      req.query.sortBy &&
      req.query.sortBy != "undefined" &&
      req.query.sortBy &&
      ["A-Z", "Z-A", "asc", "dsc", "all"].includes(req.query.sortBy) == false
    ) {
      return res.send({
        success: false,
        total: 0,
        page: _page,
        data: {
          users: []
        }
      });
    } else if (
      req.query.sortBy &&
      req.query.sortBy != "undefined" &&
      req.query.sortBy == "A-Z"
    ) {
      sortBy = { sort: { firstName: 1 } };
    } else if (
      req.query.sortBy &&
      req.query.sortBy != "undefined" &&
      req.query.sortBy == "Z-A"
    ) {
      sortBy = { sort: { firstName: -1 } };
    } else if (
      req.query.sortBy &&
      req.query.sortBy != "undefined" &&
      req.query.sortBy == "asc"
    ) {
      sortBy = { sort: { createdAt: 1 } };
    } else if (
      req.query.sortBy &&
      req.query.sortBy != "undefined" &&
      req.query.sortBy == "dsc"
    ) {
      sortBy = { sort: { createdAt: -1 } };
    }

    var skip = (_page - 1) * _limit;
    async.series(
      {
        count: function(callback) {
          User.count(function(err, count) {
            callback(null, count);
          });
        },
        users: function(callback) {
          User.find(query, [], sortBy)
            .skip(skip)
            .limit(_limit)
            .sort({ createdAt: "desc" })
            .exec(function(err, users) {
              callback(null, users);
            });
        }
      },
      function(err, results) {
        return res.send({
          success: true,
          total: results.count,
          page: _page,
          data: {
            users: results.users
          }
        });
      }
    );
  },
  signup: function(req, res, next) {
    console.log(req.file)
    if (!req.body.email || !req.body.password) {
      res.status(200);
      res.json({
        success: false,
        errors: { email: { message: "Email and password is required" } }
      });
    } else if (req.body.password != req.body.confirm_password) {
      res.status(200);
      res.json({
        success: false,
        errors: { password: { message: "Password confirmation failed" } }
      });
    } else {
      var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        roles: [req.body.role],
        image: req.file ? req.file.filename : undefined
      });
      newUser.save(function(err) {
        if (err) {
          console.log("Error in saving new user", err);
          var errors = err.errors;
          if (err.errors == undefined) {
            errors = {
              email: { message: "Email should be unique" }
            };
          }
          res.status(200);
          return res.json({
            success: false,
            errors: errors,
            message: err.errmsg
          });
        }

        // emails.sendEmail(
        //   '"InvenTally" <' + config.mailCredentials.auth.user + ">",
        //   "" + req.body.email,
        //   "Your customer profile has been created successfully",
        //   "signup-email",
        //   {
        //     user: newUser,
        //     link: `${config.appURL}`,
        //     name: `${newUser.firstName} ${newUser.lastName}`,
        //     email: newUser.email
        //   }
        // );
        var token = jwt.encode(newUser, config.secret);
        res.json({
          success: true,
          data: {
            user: newUser,
            token: "JWT " + token,
            message: "User with ID_${data._id} saved successfully!"
          }
        });
      });
    }
  },

  resetpassword: function(req, res, next) {
    console.log(req.body);
    var newPassword = req.body.new_password;
    var confirmPassword = req.body.confirm_password;
    var resetToken = req.body.reset_token;

    User.findOne(
      {
        resetPasswordKey: resetToken,
        active: true
      },
      function(err, user) {
        if (err) throw err;
        if (!user) {
          res.status(200);
          res.send({
            success: false,
            errors: { email: { message: "Email does not exist" } }
          });
        } else {
          user.password = newPassword;
          console.log(user);
          user.save((err, data) => {
            if (err) {
              res.send({
                data: { user: data },
                success: false,
                err
              });
            } else {
              res.send({
                data: { user: data },
                success: true
              });
            }
          });
        }
      }
    );
  },

  forgetpassword: function(req, res, next) {
    User.findOne(
      {
        email: req.body.forgetpass_email,
        active: true
      },
      function(err, user) {
        if (err) throw err;
        if (!user) {
          res.status(200);
          res.send({
            success: false,
            errors: { email: { message: "Email does not exist" } }
          });
        } else {
          user.resetPasswordKey = shortid.generate();
          user.save((err, data) => {
            if (err) {
              res.send({
                data: { user: data },
                success: false,
                err
              });
            } else {
              res.send({
                data: { user: data },
                success: true
              });
              
              // console.log(baseURL);
              emails.sendEmail(
                '"InvenTally" <' + config.mailCredentials.auth.user + ">",
                "" + user.email,
                "Please reset your password",
                "reset-password-email",
                {
                  link: `${config.appURL}/reset_password/${user.resetPasswordKey}`
                }
              );
              // emails.sendEmail(
              //   '"InvenTally" <' + config.mailCredentials.auth.user + ">",
              //   "" + user.email,
              //   "Reset Password",
              //   "reset-password-email",
              //   { baseURL: baseURL, link: baseURL }
              // );
            }
          });
        }
      }
    );
  },

  authenticate: function(req, res, next) {
    User.findOne(
      {
        email: req.body.email,
        active: true
      },
      function(err, user) {
        if (err) throw err;
        if (!user) {
          res.status(200);
          res.send({
            success: false,
            errors: { email: { message: "Email or password is wrong" } }
          });
        } else {
          user.comparePassword(req.body.password, function(err, isMatch) {
            if (isMatch && !err) {
              var token = jwt.encode(user, config.secret);
              res.json({
                success: true,
                data: { user: user, token: "JWT " + token },
                message: "Log in successfully"
              });
            } else {
              res.status(200);
              res.send({
                success: false,
                errors: { email: { message: "Email is wrong" } }
              });
            }
          });
        }
      }
    );
  },
  me: function(req, res, next) {
    res.json({ success: true, data: { user: req.user } });
  },
  
  update: function(req, res, next) {
    let userObject = req.body.user;
    let files = req.files;
    if (typeof userObject == "string") {
      userObject = JSON.parse(userObject);
    }
    Admin.findById(req.params.id, (err, user) => {
      if (err) {
        res.send({
          data: { user: user },
          success: false
        });
      } else {
        let deletedAvatar = user.avatar;
        user.firstName = userObject.firstName;
        user.lastName = userObject.lastName;
        user.companyName = userObject.companyName;
        user.mobileNumber = userObject.mobileNumber;
        user.company_detail = userObject.company_detail;
        user.company_city = userObject.company_city;

        if (req.files != null && req.files.avatar != undefined) {
          let file = req.files.avatar;
          if (file != undefined) {
            let imageName = file.name;
            let indexTypeImage = imageName.lastIndexOf(".");
            let imageExtension = imageName.substring(
              indexTypeImage,
              imageName.length
            );
            let imageNewName = crypto.randomBytes(16).toString('hex') + imageExtension;
            let imageSavePath = imageNewName;
            let tempPath = file.tempFilePath;
            let targetPath = "../backend/public/img/users/" + imageSavePath;
            mv(tempPath, targetPath, { mkdirp: true }, function(err) {
              if (err) console.log(err);
              else {
                user.avatar = imageNewName;
                user.save((err, data) => {
                  if (err) {
                    res.send({
                      data: { user: data },
                      success: false
                    });
                  } else {
                    // Remove old pic
                    fs.unlink(
                      path.join(
                        __dirname,
                        "../public/img/users/" + deletedAvatar
                      ),
                      function(err) {
                        if (err) return console.log(err);
                      }
                    );
                    res.send({
                      data: { user: data },
                      success: true
                    });
                  }
                });
              }
            });
          }
        } else {
          user.save((err, data) => {
            if (err) {
              res.send({
                data: { user: data },
                success: false
              });
            } else {
              res.send({
                data: { user: data },
                success: true
              });
            }
          });
        }
      }
    });
  },

  updateUser: function(req, res, next) {
    let userObject = req.body.user;
    if (typeof userObject == "string") {
      userObject = JSON.parse(userObject);
    }
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.send({
          data: { user: user },
          success: false
        });
      } else {
        user.firstName = userObject.firstName;
        user.lastName = userObject.lastName;
        user.roles = userObject.roles;
        user.companyName = userObject.companyName;
        user.mobileNumber = userObject.mobileNumber;
        user.active = userObject.active;
        user.userType = userObject.userType;
        user.position = userObject.position;
        user.city = userObject.city;
        user.fields = userObject.fields;
        user.save((err, data) => {
          if (err) {
            res.status(400).send({
              data: { user: {} },
              message: err
            });
          } else {
            res.send({
              data: { user: data },
              success: true
            });
          }
        });
      }
    });
  }
};
