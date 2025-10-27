const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;
const config = require("../config");

const DrillSchema = new Schema({
	name: {
		type: String,
		required: true,
  },
  
	athlete: {
		type: Schema.Types.ObjectId,
		ref: "athlete",
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: "categories",
	},
	speedLevel: {
		type: Schema.Types.ObjectId,
		ref: "speedlevel",
	},
	difficultyLevel: {
		type: Schema.Types.ObjectId,
		ref: "difficultylevel",
  },
	thumbnail: {
		type: String,
	},
	video: {
		type: String,
	},
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
