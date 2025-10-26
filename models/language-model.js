const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LanguageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    layout_direction: {
        type: String,
        enum: ["ltr", "rtl"],
        required: true
    },
    language_code: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_default: {
        type: Boolean,
        default: false,
    }

},
    {
        timestamps: true
    });

const LanguageModel = mongoose.model("language", LanguageSchema);
module.exports = LanguageModel;
