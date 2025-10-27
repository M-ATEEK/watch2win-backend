const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;
const config = require("../config");

const AthleteSchema = new Schema({
  auto_increment_id: { type: Number, default: 0 },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const AthleteModel = mongoose.model("athlete", AthleteSchema);
module.exports = AthleteModel;

