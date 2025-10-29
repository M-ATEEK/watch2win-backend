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
    type: Number, // 30
    required: true
  },
  condition:{
    type: Number,
    required: true // 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const SpeedLevelModel = mongoose.model("speedlevel", SpeedLevelSchema);
module.exports = SpeedLevelModel;