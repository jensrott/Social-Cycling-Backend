const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  startLocation: {
    type: String,
    // required: true
  },

  endLocation: {
    type: String,
    // required: true
  },

  start_lat: {
    type: Number,
    required: true,
  },

  start_lng: {
    type: Number,
    required: true,
  },

  stop_lat: {
    type: Number,
    required: true,
  },

  stop_lng: {
    type: Number,
    required: true,
  },

  origin: {
    type: String,
    required: false
  },

  destination: {
    type: String,
    required: false
  },

  distance: {
    type: String,
    required: false
  },

  moving_time: {
    type: String,
    required: false
  },

  // start_hour: {
  //   type: Date,
  //   required: true,
  // },

  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],

  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      },
      description: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      profilePicture: {
        type: String
      },
      created_at: {
        type: Date,
        default: Date.now
      }
    }
  ],
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

module.exports = mongoose.model("post", PostSchema);
