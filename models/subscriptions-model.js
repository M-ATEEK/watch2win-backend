const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;
const config = require("../config");
 

const SubscriptionsSchema = new Schema({
  auto_increment_id: { type: Number, default: 0 },
  name: {
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true
  },
  details:{
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SubscriptionsModel = mongoose.model("subscriptions", SubscriptionsSchema);
module.exports = SubscriptionsModel;