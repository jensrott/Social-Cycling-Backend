const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  profilePicture: {
    type: String,
    default: 'profielfoto.png'
  },

  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
    required: false
  },

  // TODO: Facebook login
  facebookProvider: {
    id: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false
    }
  },

  // TODO: Google login
  googleProvider: {
    id: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false
    }
  },

  // tokens: [{
  //     token: {
  //         type: String,
  //         required: true
  //     }
  // }]
});

module.exports = mongoose.model("user", userSchema);
