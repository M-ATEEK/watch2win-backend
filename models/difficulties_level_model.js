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
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const DifficultyLevelModel = mongoose.model("difficultylevel", DifficultyLevelSchema);
module.exports = DifficultyLevelModel;