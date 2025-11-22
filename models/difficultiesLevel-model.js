const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;
const config = require("../config");

const DifficultyLevelSchema = new Schema({
  auto_increment_id: { type: Number, default: 0 },
  name: {
    type: String,
    required: true
  },
  // add points field here 20
  points:{
    type:Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const DifficultyLevelModel = mongoose.model("difficultylevel", DifficultyLevelSchema);
module.exports = DifficultyLevelModel;