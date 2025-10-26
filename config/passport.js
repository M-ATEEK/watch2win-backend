const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var User = require("../models/users-model");

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
          }
        },
        function(err, results) {
          if (results.user) {
              results.user.is_admin = false;
            return done(null, results.user);
          } else {
            return done(null, false);
          }
        }
      );
    })
  );
};
