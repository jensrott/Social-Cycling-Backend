const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const errorHandler = require("../utils/errorHandler");
const validateProfileInput = require("../validators/profile");

// Here change for profile
exports.createOrUpdateProfile = (req, res, next) => {
  const { errors, isValid } = validateProfileInput(req.body);

  if (!isValid) {
    return res.status(400).send(errors);
  }

  const profileFields = {};
  profileFields.user = req.user.id;

  if (req.body.username) profileFields.username = req.body.username;
  if (req.body.level) profileFields.level = req.body.level;
  if (req.body.location) profileFields.location = req.body.location;

  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

  if (req.body.bio) profileFields.bio = req.body.bio;

  Profile.findOne({
    user: req.user.id
  })
    .populate("user", ["name", "profilePicture"])
    .then(profile => {
      if (profile) {
        // Update the profile
        Profile.findOneAndUpdate(
          {
            user: req.user.id
          },
          {
            $set: profileFields
          },
          {
            new: true
          }
        ).then(profile => res.status(200).send(profile));
      } else {
        // Create a new profile
        Profile.findOne({
          username: profileFields.username
        }).then(profile => {
          if (profile) {
            errors.username = "This username already exists";
            return res.status(400).send(errors);
          }

          // else we create one
          new Profile(profileFields).save().then(profile => {
            res.status(200).send(profile);
          });
        });
      }
    });
};

exports.getCurrentProfile = (req, res, next) => {
  Profile.findOne({
    user: req.user.id
  })
    .then(profile => {
      return res.status(200).send(profile);
    })
    .catch(err => {
      return errorHandler(400, `${err}`, next);
    });
};

exports.deleteCurrentProfile = (req, res, next) => {
  Profile.findOneAndRemove({
    user: req.user.id
  }).then(() => {
    User.findOneAndRemove({
      _id: req.user.id
    }).then(() =>
      res.json({
        success: true
      })
    );
  });
};

exports.getProfileByUsername = (req, res, next) => {
  const errors = {};
  const username = req.params.username;
  Profile.findOne({
    username: username
  })
    .populate("user", ["name", "profilePicture"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        errorHandler(404, `${errors}`, next);
      }

      return res.status(200).send(profile);
    })
    .catch(err => {
      errorHandler(404, `${err}`, next);
    });
};

exports.getProfileByUserId = (req, res, next) => {
  const errors = {};
  const userId = req.params.user_id;
  Profile.findOne({
    user: userId
  })
    .populate("user", ["name", "profilePicture"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        errorHandler(404, `${errors}`, next);
      }

      return res.status(200).send(profile);
    })
    .catch(err => {
      errorHandler(404, `${err}`, next);
    });
};

exports.getAllProfiles = (req, res, next) => {
  const errors = {};
  const query = Profile.find();
  query.populate("user", ["name", "profilePicture"]);
  query.sort({ created_at: -1 });
  query.exec((err, profiles) => {
    // console.log(profiles)
    if (!profiles) {
      errors.noprofiles = "There are not profiles!";
      return errorHandler(404, `Could not find profiles! ${errors}`, next);
    } else if (err) {
      return errorHandler(400, `${err}`, next);
    }
    res.status(200).send(profiles);
  });
};

// Get the posts created by a specific profile
exports.getPostsFromProfileByUserId = (req, res, next) => {
  const errors = {};
  const userId = req.params.user_id;
  // We get the data from the profile

  // We then get the user attached to the profile
  Profile.findOne({
    user: userId
  })
    .populate("user", ["name", "profilePicture"])
    .then(profile => {
      const profileUserId = profile.user;
      // We get the posts attached to the user.
      Post.find({
        user: profileUserId
      }).then(posts => {
        if (!posts) {
          errors.noposts = "There are not posts for this profile!";
          errorHandler(404, `Could not find posts for this profile! ${errors}`, next);
        }
        return res.status(200).send(posts);
      }).catch(err => {
        errorHandler(404, `${err}`, next);
      })
    })
}

exports.getLikesFromProfileByUserId = (req, res, next) => {

}

// Helpers
exports.deleteAllProfiles = (req, res, next) => {
  Profile.remove({})
    .then(profiles => {
      if (!profiles) {
        return errorHandler(404, `Could not delete profiles!`, next);
      }
      return res.status(200).send(profiles);
    })
    .catch(err => {
      return errorHandler(400, `${err}`, next);
    });
};
