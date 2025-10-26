const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var User = require("../models/users-model");
var Admin = require("../models/admin-model.js");

var async = require("async");

const config = require("../config");

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
  opts.secretOrKey = config.secret;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      async.series(
        {
          user: function(callback) {
            User.findById(jwt_payload._id, (err, User) => {
              if (err) {
                callback(err, null);
              }
              if (User) {
                callback(null, User);
              } else {
                callback(null, null);
              }
            });
          },
          admin: function(callback) {
            // Find by _id and role
            // See https://trello.com/c/Bu7cUlLc/232-17-if-manager-inpsector-role-is-changed-by-the-admin-they-should-get-logged-out-automatically
            Admin.findOne(
              { _id: jwt_payload._id, role: jwt_payload.role },
              (err, Admin) => {
                if (err) {
                  callback(err, null);
                }
                if (Admin) {
                  callback(null, Admin);
                } else {
                  callback(null, null);
                }
              }
            );
          }
        },
        function(err, results) {
          if (results.user) {
              results.user.is_admin = false;
            return done(null, results.user);
          } else if (results.admin) {
            results.admin.roles = [results.admin.role];
              results.admin.is_admin = true;
            return done(null, results.admin);
          } else {
            return done(null, false);
          }
        }
      );
    })
  );
};
