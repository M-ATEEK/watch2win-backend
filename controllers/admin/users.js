var Admin = require("../../models/admin-model.js");
var User = require("../../models/users-model.js");
const bcrypt = require("bcryptjs");
var jwt = require("jwt-simple");
const config = require("../../config");
const shortid = require("shortid");
const async = require("async");
const userPermissionHierarchyIndex = require("../../helpers/userPermissionsHierarchy");
const _ = require("lodash");

const { validationResult } = require("express-validator");
var ObjectId = require("mongodb").ObjectID;
const userModel = require("../../models/users-model");
const fs = require('fs')

module.exports = {
    // New CRUD functions from commit d72cad37
    indexBasic: function (req, res, next) {
        let searchField = req.query.search;
        if (searchField === undefined) {
            userModel.find({}, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: "users fetched successfully",
                        data: {
                            user: data
                        }
                    });
                }
            });
        }
        else {
            userModel.find({ firstName: { $regex: searchField, $options: '$i' } }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: "users searched successfully",
                        data: {
                            user: data
                        }
                    });
                }

            })
        }
    },
    deleteBasic: function (req, res, next) {
        let id = req.params.id;
        let params = req.body;

        userModel.findOne({ _id: ObjectId(id) }, {}, (err, user) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (user) {
                user.remove();
                res.send({
                    message: "success.",
                    data: {
                        user: user
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    },
    upsert: async function (req, res, next) {
        let id = req.params.id;
        let params = req.body;
        
        if(req.file){
            await userModel.findOne({_id: id}, {},
                (err, user) => {
                    if(user && user.image !== undefined){
                        fs.unlink(`./public/img/${user.image}`, (err) => {
                            if(err){
                                console.log(err)
                            } else {
                                console.log('file deleted')
                            }
                        })
                    }
                    console.log(user)
                }
            )
      
            params = {
                ...req.body,
                image: req.file.filename
            }
        } else if(req.file === undefined){
            params = req.body
        }
        
        if (id == 'new') {
            id = new ObjectId();
        } else {
            id = ObjectId(id);
        }
    
        userModel.findOneAndUpdate({ _id: id }, params, { new: true }, (err, user) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send({
                    message: "success.",
                    data: {
                        user: user
                    }
                });
            }
        });
    },
    showBasic: function (req, res, next) {
        let id = req.params.id;
        userModel.findOne({ _id: ObjectId(id) }, {}, (err, user) => {
            if (err) {
                res.sendStatus(500);
            }
            else if (user) {
                res.send({
                    message: "success.",
                    data: {
                        user: user
                    }
                });
            } else {
                res.sendStatus(500);
            }
        });
    },
  searchAdminUsers: function(req, res, next) {
    var _page = parseInt(req.query.page) || 1;
    var _limit = parseInt(req.query.limit) || 1000;
    var sortBy = {};

    var query = {};

    // Filtering
    query["role"] = req.query.role || undefined;
    query.firstName = req.query.name
      ? {
          $regex: req.query.name + ".*"
        }
      : undefined;
    // Remove all the values from the object that are undefined or all
    query = _.omitBy(query, value => value === undefined || value === "all");

    var skip = (_page - 1) * _limit;
    async.series(
      {
        count: function(callback) {
          Admin.count(function(err, count) {
            callback(null, count);
          });
        },
        users: function(callback) {
          Admin.find(query, [], sortBy)
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
  index: function(req, res, next) {
    User.find({}, "", (err, users) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.send({ items: users });
      }
    }).sort({ _id: -1 });
  },
  search: function(req, res, next) {
    // Request payload destructure
    const { term, search_by_field } = req.query;
    const queryExpression = new RegExp(term, "ig");
    var searchQuery = {
      name: {
        $regex: queryExpression
      }
    };
    if (search_by_field != undefined) {
      searchQuery = {};
      searchQuery[search_by_field] = {
        $regex: queryExpression
      };
    }

    // Create a REGEX for searching

    async.series(
      {
        users: callback => {
          User.aggregate([
            {
              $project: {
                name: {
                  $concat: ["$firstName", " ", "$lastName"]
                },
                firstName: 1,
                lastName: 1,
                companyName: 1,
                email: 1,
                mobileNumber: 1,
                active: 1,
                roles: 1,
                userType: 1,
                createAt: 1,
                code: 1,
                city: 1,
                position: 1
              }
            },
            {
              $match: searchQuery
            }
          ]).exec((err, users) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, users);
            }
          });
        },
        admins: callback => {
          Admin.aggregate([
            {
              $project: {
                name: {
                  $concat: ["$firstName", " ", "$lastName"]
                },
                firstName: 1,
                lastName: 1,
                companyName: 1,
                email: 1,
                mobileNumber: 1,
                active: 1,
                role: 1,
                userType: 1,
                createAt: 1,
                emailJobNotification: 1
              }
            },
            {
              $match: {
                name: {
                  $regex: queryExpression
                },
                role: "inspector"
              }
            }
          ]).exec((err, admins) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, admins);
            }
          });
        }
      },
      (err, results) => {
        if (err) {
          res.status(500);
        } else {
          let users = results.users.concat(results.admins);
          res.send({
            message: users.length ? "Users fetched" : "No users found",
            data: {
              users
            }
          });
        }
      }
    );
  },
  update: function(req, res, next) {
    // Add functionality to be able to update from both collections

    async.series(
      {
        user: callback => {
          User.findOne({ _id: req.params.id }).exec((err, user) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, user);
            }
          });
        },
        admin: callback => {
          Admin.findOne({ _id: req.params.id }).exec((err, admin) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, admin);
            }
          });
        }
      },
      (err, results) => {
        if (err) {
          console.error("Error finding user entities", err);
          res.status(500);
        } else {
          let user = null;
          if (results.user) {
            user = results.user;
          } else if (results.admin) {
            user = results.admin;
          } else {
            return res.status(400).send({
              message: "User not found"
            });
          }

          user.firstName = req.body.firstName || user.firstName;
          user.roles = req.body.roles || user.roles;
          user.lastName = req.body.lastName || user.lastName;
          user.companyName = req.body.companyName || user.companyName;
          user.email = req.body.email || user.email;
          user.mobileNumber = req.body.mobileNumber || user.mobileNumber;
          user.password = req.body.password || user.password;
          user.userType = req.body.userType || user.userType;
          user.active = req.body.active || user.active;
          user.city = req.body.city || user.city;
          user.position = req.body.position || user.position;
          if (req.body.position == undefined && user.position == undefined) {
            user.position = "landlord";
          }

          if (
            req.body.docusign_access_token ||
            req.body.docusign_access_token == null
          ) {
            user.docusign_access_token = req.body.docusign_access_token;
          } else {
            user.docusign_access_token = user.docusign_access_token;
          }
          console.log(req.body);
          user.$locals.isAdmin = req.user.is_admin;
          user.$locals.createdById = req.user._id;
          user.save((err, data) => {
            if (err) {
              console.log(err);
              res.sendStatus(500);
            } else {
              res.send({
                message: `User with ID_${data._id} saved successfully!`,
                data: {
                  user: user
                }
              });
            }
          });
        }
      }
    );
  },
  show: function(req, res, next) {
    User.findById(req.params.id, (err, data) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.send({
          item: data
        });
      }
    });
  },
  create: function(req, res, next) {
    if (
      userPermissionHierarchyIndex.isHigherThanAsked(
        req.user.role,
        req.body.role
      ) ||
      (req.user._id != req.body._id && req.user.role == "manager")
    ) {
      let user = null;

      if (userPermissionHierarchyIndex.isAdminRole(req.body.role)) {
        user = new Admin({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          emailJobNotification: req.body.emailJobNotification
        });

        user.$locals.isAdmin = req.user.is_admin;
        user.$locals.createdById = req.user._id;
      } else {
        user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          companyName: req.body.companyName,
          email: req.body.email,
          mobileNumber: req.body.mobileNumber,
          password: req.body.password,
          userType: req.body.userType,
          active: req.body.active || true,
          city: req.body.city,
          role: [req.body.role],
          userType: req.body.userType,
          position: req.body.position || "landlord"
        });

        user.$locals.isAdmin = req.user.is_admin;
        user.$locals.createdById = req.user._id;
      }
      user.save((err, data) => {
        if (err) {
            if (err.code === 11000) {
              res.status(err.name === "MongoError" ? 400 : 500).send({
                message:
                  err.name === "MongoError"
                    ? "Email already exist , Please insert another Email."
                    : err.errmsg || undefined
              });
            }
            else {
          res.status(err.name === "ValidationError" ? 100 : 500).send({
            message:
              err.name === "ValidationError"
                ? "All fields are required"
                : err.errmsg || undefined
          });
            }
        } else {
          res.send({
            message: `User with ID_${data._id} saved successfully!`
          });
        }
      });
    } else {
      res.status(403).send({
        message: "Access forbidden"
      });
    }
  },
  delete: function(req, res, next) {
    const { id } = req.params;
    async.series(
      {
        userDeleted: callback => {
          User.findOne({ _id: id }).exec((err, user) => {
            if (err) {
              callback(err, null);
            } else {
              if (user) {
                user.$locals.isAdmin = req.user.is_admin;
                user.$locals.createdById = req.user._id;
              }
              callback(null, user);
            }
          });
        },
        adminDeleted: callback => {
          Admin.findOne({ _id: id }).exec((err, user) => {
            if (err || !user) {
              callback(err, null);
            } else {
              if (user) {
                user.$locals.isAdmin = req.user.is_admin;
                user.$locals.createdById = req.user._id;
              }
              callback(null, user);
            }
          });
        }
      },
      (err, results) => {
        if (err) {
          console.log("Error deleting user", err);
          return res.status(500).send({
            message: "Unknown DB Error"
          });
        } else {
          results.userDeleted
            ? results.userDeleted.remove()
            : results.adminDeleted.remove();
          return res.send({
            message: "User deleted"
          });
        }
      }
    );
  },

  validateToken: function(req, res, next) {
    res.send({
      message: "Valid token"
    });
  },

  authenticate: function(req, res, next) {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send({
        message: "Validation errors",
        errors
      });
    } else {
      // Validate credentials
      const { email, password } = req.body;
      Admin.findOne({ email })
        .lean()
        .exec((err, admin) => {
          if (err) {
            // Database connection problems
            res.status(500);
          } else {
            if (!admin) {
              res.status(401).send({
                message: "User not found"
              });
            } else {
              // Validate Password
              bcrypt.compare(password, admin.password).then(valid => {
                if (!valid) {
                  res.status(401).send({
                    message: "Incorrect credentials"
                  });
                } else {
                  var token = "JWT " + jwt.encode(admin, config.secret);
                  res.send({
                    message: "Authenticated Successfully",
                    token,
                    user: admin
                  });
                }
              });
            }
          }
        });
    }
  },

  createAdmin: async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({
        message: "Validation errors",
        errors
      });
    } else {
      const { firstName, lastName, email, password, role } = req.body;
      const dir = req.body.dir || "dist/img/avatars/uploaded";

      const saveAdmin = avatarFile => {
        // Create new admin document
        let newAdmin = new Admin({
          firstName,
          lastName,
          role,
          email,
          avatar: avatarFile,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        });

        if (req.user) {
          newAdmin.$locals.isAdmin = req.user.is_admin;
          newAdmin.$locals.createdById = req.user._id;
        }

        newAdmin.save((err, saved) => {
          if (err) {
            res.status(400).send({
              message: err.errmsg
            });
          } else {
            // Don't expose the password hash
            saved.password = undefined;
            res.send({
              message: "Admin created",
              admin: saved
            });
          }
        });
      };

      // Check if the Admin already exists
      const adminExists = await Admin.findOne({ email });
      if (adminExists) {
        res.status(400).send({
          message: "A user with this email already exists"
        });
      } else {
        if (!req.files) {
          saveAdmin("default.jpg");
        } else {
          // Uplod the avatar if available
          const newFileName = shortid.generate() + req.files.file.name;
          let uploadDir = "../" + dir + "/" + newFileName;
          req.files.file.mv(uploadDir, err => {
            if (err) {
              res.status(500).send({
                message: "Error uploading Avatar"
              });
            } else {
              saveAdmin(newFileName);
            }
          });
        }
      }
    }
  }
};
