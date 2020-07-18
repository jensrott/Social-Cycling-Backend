const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    username: {
        type: String,
        required: true,
        max: 40
    },

    level: {
        type: String,
        required: true
    },

    location: {
        type: String,
    },

    bio: {
        type: String,
    },

    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        instagram: {
            type: String
        },
    },

    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model("profile", ProfileSchema);
