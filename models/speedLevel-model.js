const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;
const config = require("../config");

const SpeedLevelSchema = new Schema({
  auto_increment_id: { type: Number, default: 0 },
  name: {
    type: String,
    required: true
  },
  points:{
    type: Number,
    required: true
  },
  condition:{
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const SpeedLevelModel = mongoose.model("speedlevel", SpeedLevelSchema);
module.exports = SpeedLevelModel;