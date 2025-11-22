const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;
const config = require("../config");
 

const EarningSchema = new Schema({
  totalEarning:{
   type:Number, 
   default:0
  },
});

const EarningModel = mongoose.model("earning", EarningSchema);
module.exports = EarningModel;