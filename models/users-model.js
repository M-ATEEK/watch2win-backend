const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");
var emails = require("../services/email");
var ObjectId = require("mongodb").ObjectID;
// const Activity = require("../models/activities-model"); // Removed in cleanup
var passport = require("passport");

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
const config = require("../config");

const UsersSchema = new Schema({
  auto_increment_id: { type: Number, default: 0 },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  userName: {
    type: String,
    unique: true,
    lowercase:true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address"
    ]
  },
  password: { type: String, required: true },
  active: { type: Boolean, default: true, required: true },
  roles: {
    type: [
      {
        type: String,
        enum: ["admin", "user"]
      }
    ],
    default: ["user"]
  },
  image: {
    type: String
  },
  // add watchedVideos array { video_id, watch_count,drill_id}
  // add points Number type, set default 0,
  source:{
     type:String,
     enum:["google","local","facebook"]
  },
  favouriteDrillVideos: [{
    type: Schema.Types.ObjectId
  }],
  watchLaterDrillVideos: [{
    type: Schema.Types.ObjectId
  }],
  code: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordKey: {
    type: String,
    default: null
  }
});

UsersSchema.virtual("name").get(function() {
  return this.firstName + " " + this.lastName;
});

UsersSchema.pre("save", function(next) {
  var user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

var randomString = function(len, bits) {
  bits = bits || 36;
  var outStr = "",
    newStr;
  while (outStr.length < len) {
    newStr = Math.random()
      .toString(bits)
      .slice(2);
    outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length));
  }
  return outStr.toUpperCase();
};

UsersSchema.pre("save", function(next) {
  var user = this;
  if (this.isNew || user.code == undefined) {
    user.code =
      user.firstName.slice(0, 1) +
      user.lastName.slice(0, 3) +
      "-" +
      randomString(6, 16);
    next();
  } else {
    return next();
  }
});
UsersSchema.pre("save", function(next) {
  this.wasNew = this.isNew;
  this.wasUpdated = this.isModified();
  next();
});

UsersSchema.pre("save", function() {
  if (this.isModified("roles")) {
    emails.sendEmail(
      '"InvenTally" <' + config.mailCredentials.auth.user + ">",
      " " + this.email  ,
      "Your role has been changed on inventally",
      "role-changed-email",
      { userRole: this.roles[0], link: `${config.appURL}` }
    );
  }
});

UsersSchema.post("save", function(doc) {
  if (
    this.isNew ||
    doc.auto_increment_id == 0 ||
    doc.auto_increment_id == undefined
  ) {
    UsersModel.findOne({})
      .sort("-auto_increment_id")
      .limit(1) // give me the max
      .exec(function(err, user) {
        UsersModel.updateOne(
          { _id: ObjectId(doc._id) },
          { $set: { auto_increment_id: user.auto_increment_id + 1 } },
          function(error, user) {
            if (error) {
            }
          }
        );
      });
  }
});

UsersSchema.post("save", function(user) {
  if (this.wasNew) {
    let activityObject = {
      action: "create",
      subject: "user",
      subject_id: user._id,
      user: !this.$locals.isAdmin ? this.$locals.createdById : null,
      admin: this.$locals.isAdmin ? this.$locals.createdById : null
    };
    let activity = new Activity(activityObject);
    activity.save((err, data) => {});
  } else if (this.wasUpdated) {
    let activityObject = {
      action: "update",
      subject: "user",
      subject_id: user._id,
      user: !this.$locals.isAdmin ? this.$locals.createdById : null,
      admin: this.$locals.isAdmin ? this.$locals.createdById : null
    };

    let activity = new Activity(activityObject);
    activity.save((err, data) => {});
  }
});

UsersSchema.post("remove", function(result) {
  let activityObject = {
    action: "delete",
    subject: "user",
    subject_id: this._id,
    user: !this.$locals.isAdmin ? this.$locals.createdById : null,
    admin: this.$locals.isAdmin ? this.$locals.createdById : null
  };

  let activity = new Activity(activityObject);
  activity.save((err, data) => {});
});

UsersSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

const UsersModel = mongoose.model("user", UsersSchema);
module.exports = UsersModel;
