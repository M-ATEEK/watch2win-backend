const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;
const config = require("../config");

const DrillSchema = new Schema({
	name: {
		type: String,
		required: true,
  },
  thumbnail:{
	type:String
  },
	athlete: {
		type: Schema.Types.ObjectId,
		ref: "athlete",
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: "categories",
	},
	difficultyLevel: {
		type: Schema.Types.ObjectId,
		ref: "difficultylevel",
  },
   videos:[{
	 thumbnail:{
		  type:String
		},
        video:{
			type:String	
		}, 
		speedLevel: {
			type: Schema.Types.ObjectId,
			ref: "speedlevel",
		},
		duration:{
		 type:Number
		},
		totalLikes:{
			type:Number,
			default:0
		},
		isPremium: {
			type: Boolean,
			default: false,
		} 
  }], 
	isPremium: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const DrillsModel = mongoose.model("drills", DrillSchema);
module.exports = DrillsModel;