const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SentenceSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    is_static: {
        type: Boolean,
        required: true,
        default: false
    },
    translations: {
        type: Object,
        required: true,
        default: {}
    }
},
    {
        timestamps: true
    });

const SentenceModel = mongoose.model("sentence", SentenceSchema);
module.exports = SentenceModel;
