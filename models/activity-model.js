const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = require("mongodb").ObjectID;
const config = require("../config");

const ActivitySchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    type: {
        type: String
    },
    video_id: {
        type: Schema.Types.ObjectId,
    },
    drill_id: {
        type: Schema.Types.ObjectId,
        ref: "drills",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ActivityModel = mongoose.model("activity", ActivitySchema);
module.exports = ActivityModel;
