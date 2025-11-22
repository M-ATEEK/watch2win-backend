const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;
const config = require("../config");

const CategoriesSchema = new Schema({
  auto_increment_id: { type: Number, default: 0 },
  name: {
    type: String,
    required: true
  },
  image:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const CategoriesModel = mongoose.model("categories", CategoriesSchema);
module.exports = CategoriesModel;