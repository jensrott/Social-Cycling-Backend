const Post = require("../models/postModel");
const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const validatePostInput = require("../validators/posts");
const validateCommentInput = require("../validators/comments");
const errorHandler = require("../utils/errorHandler");

const distanceCalculator = require('google-distance-matrix');

distanceCalculator.key(process.env.GOOGLE_MAPS_API_KEY);
distanceCalculator.mode('bicycling');

const { Client, Status } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

require("dotenv").config();

exports.createPost = (req, res) => {

  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    return res.status(400).send(errors);
  }

  generateGroupRide(req.body.startLocation, req.body.endLocation, req, res);

};

// TODO: Validate that the distance is not crazy false
/** 
 * Create a group ride based on the start and end location 
 * that has been given.
 * @param {string} originsInput
 * @param {string} destinationsInput
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} Post Object with data 
 */
function generateGroupRide(originsInput, destinationsInput, req, res) {
  let origins = [originsInput];
  let destinations = [destinationsInput];

  distanceCalculator.matrix(origins, destinations, (errors, distances) => {
    if (errors) {
      return res.status(400).send(errors);
    }
    if (distances.status == 'OK') {
      for (let i = 0; i < origins.length; i++) {
        for (let j = 0; j < destinations.length; j++) {
          let origin = distances.origin_addresses[i];
          let destination = distances.destination_addresses[j];
          if (distances.rows[0].elements[j].status == 'OK') {
            let distance = distances.rows[i].elements[j].distance.text;
            console.log(`Distance from ${origin} to ${destination} is ${distance}`);

            // We get the latitude and longitude from the origin address
            client.geocode({
              params: {
                address: origin,
                key: process.env.GOOGLE_MAPS_API_KEY
              }
            }).then(response => {
              const originLat = response.data.results[0].geometry.location.lat;
              const originLng = response.data.results[0].geometry.location.lng;

              console.log(`originLat: ${originLat}`);
              console.log(`originLng: ${originLng}`);

              // We get the latitude and longitude from the destination address
              client.geocode({
                params: {
                  address: destination,
                  key: process.env.GOOGLE_MAPS_API_KEY
                }
              }).then(response => {
                const destinationLat = response.data.results[0].geometry.location.lat;
                const destinationLng = response.data.results[0].geometry.location.lng;

                console.log("destinationLat", destinationLat);
                console.log("destinationLet", destinationLng);

                client.distancematrix({
                  params: {
                    origins: [{ lat: originLat, lng: originLng }],
                    destinations: [{ lat: destinationLat, lng: destinationLng }],
                    mode: 'bicycling',
                    key: process.env.GOOGLE_MAPS_API_KEY
                  }
                }).then(response => {
                  let distance = response.data.rows[0].elements[0].distance.text;
                  let moving_time = response.data.rows[0].elements[0].duration.text;

                  let newPost = new Post({
                    user: req.user.id, // We save the id from the user in the post
                    title: req.body.title,
                    description: req.body.description,
                    start_lat: originLat,
                    start_lng: originLng,
                    stop_lat: destinationLat,
                    stop_lng: destinationLng,
                    origin: origin,
                    destination: destination,
                    distance: distance,
                    moving_time: moving_time,
                    startLocation: originsInput,
                    endLocation: destinationsInput
                  });
                  newPost.save((err, post) => {
                    if (err) {
                      return errorHandler(400, `${err}`, next);
                    }
                    return res.status(200).send(post);
                  });
                }).catch(err => {
                  console.log("err", err);
                })

              }).catch(err => {
                console.log(err);
              })

            }).catch(err => {
              console.log(err);
            })
          } else {
            console.log(`${destination} is not reachable by land from ${origin}`);
            return res.status(400).send({ wrongFormat: "Format needs to be: State, Country!" })
          }
        }
      }
    }
  })
}

exports.getAllPosts = (req, res, next) => {
  const query = Post.find();
  query.sort({ created_at: -1 });

  query.exec((err, posts) => {
    if (!posts) {
      return errorHandler(404, `Could not find posts!`, next);
    } else if (err) {
      return errorHandler(400, `${err}`, next);
    }
    return res.status(200).send(posts);
  });
};

exports.updatePostById = (req, res, next) => {
  const postId = req.params.id;
  const postFields = {};
  if (req.body.title) postFields.title = req.body.title;
  if (req.body.description) postFields.description = req.body.description;
  if (req.body.startLocation || req.body.endLocation) {
    // postFields.startLocation = req.body.startLocation;
    // postFields.endLocation = req.body.endLocation;
    generateGroupRide(req.body.startLocation, req.body.endLocation, req, res);
  }

  Post.findByIdAndUpdate(postId,
    {
      $set: postFields
    },
    {
      new: true
    }
  )
    .then(post => {
      if (!post) {
        return errorHandler(
          404,
          `Could not find post with id: ${postId}!`,
          next
        );
      }
      return res.status(200).send(post);
    })
    .catch(err => {
      return errorHandler(400, `${err}`, next);
    });
};

exports.getPostById = (req, res, next) => {
  const postId = req.params.id;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        return errorHandler(
          404,
          `Post with id: ${postId} doesn't exist!`,
          next
        );
      }
      return res.status(200).send(post);
    })
    .catch(err => {
      return errorHandler(400, `${err}`, next);
    });
};

// Get the posts created from the logged in user.
exports.getPostsFromCurrentUser = (req, res, next) => {
  const userId = req.user.id;
  const query = Post.find({
    user: userId
  });
  query.sort({ created_at: -1 });
  query.exec((err, posts) => {
    if (!posts) {
      return errorHandler(
        404,
        `Could not find user with id: ${userId} his posts!`,
        next
      );
    } else if (err) {
      return errorHandler(400, `${err}`, next);
    }
    return res.status(200).send(posts);
  });
};

// TODO: Get the posts created from the logged in user.
exports.getLikedPostsFromUser = (req, res, next) => {
  const userId = req.user.id;
  const query = Post.find();
  // likes.user

  // We return an array of posts

};

// Get the profile that is connected to the post
// Get the profile that created the post
exports.getProfileFromPost = (req, res, next) => {
  const postId = req.params.id;
  Post.findOne({
    _id: postId
  }).then(post => {
    const postUserId = post.user;
    Profile.findOne({
      user: postUserId
    }).then(profile => {
      if (!profile) {
        return errorHandler(404, `Could not find profile with id: ${postUserId}!`, next);
      }
      return res.status(200).send(profile);
    }).catch(err => {
      return errorHandler(400, `${err}`, next);
    })
  })
}

// Get the profile that is connected to the profilePicture
exports.getProfileFromProfilePicture = (req, res, next) => {
  const profilePictureSrc = req.params.profile_pic;
  // We get the user connected to the profile picture
  User.findOne({
    profilePicture: profilePictureSrc
  }).then(user => {
    if (!user) {
      return errorHandler(404, `Could not find a user with profile picture: ${profilePictureSrc}!`, next);
    }
    return res.status(200).send(user);
  })
  // We get the user connected to the profile
}

exports.deletePostById = (req, res, next) => {
  const postId = req.params.id;
  Post.remove({ _id: postId })
    .then(post => {
      if (!post) {
        return errorHandler(
          404,
          `Could not delete post with id: ${postId}!`,
          next
        );
      }
      return res.status(200).send(post);
    })
    .catch(err => {
      return errorHandler(400, `${err}`, next);
    });
};

exports.likePost = (req, res, next) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        // Post linked to a profile
        if (post.likes.filter(like => like.user.toString === req.user.id).length > 0) {
          return res
            .status(400)
            .json({ alreadyliked: "User already liked this post!" });
        }

        // Else add to the beginning of the array
        post.likes.unshift({ user: req.user.id });

        post.save().then(post => {
          return res.json(post);
        });
      })
      .catch(err => {
        res.status(400).json({ postnotfound: "No Post found!" });
      });
  });
};

exports.unlikePost = (req, res, next) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
          return res
            .status(400)
            .json({ notliked: "User did not like this post yet!" });
        }
        // else
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);

        post.save().then(post => {
          return res.json(post);
        });
      })
      .catch(err => {
        res.status(400).json({ postnotfound: "No Post found!" });
      });
  });
};

exports.addComment = (req, res, next) => {
  const { errors, isValid } = validateCommentInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        description: req.body.description,
        name: req.body.name,
        profilePicture: req.body.profilePicture,
        user: req.user.id
      };

      // Add comment to comments array at the beginning of the array
      post.comments.unshift(newComment);
      post.save().then(post => {
        res.json(post);
      });
    })
    .catch(err => res.status(404).json({ postnotfound: "No post found!" }));
};

exports.removeComment = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res
          .status(404)
          .json({ commentnotexists: "Comment does not exist" });
      }
      // else
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

      post.comments.splice(removeIndex, 1);

      post.save().then(post => res.json(post));
    })
    .catch(err => {
      return errorHandler(404, `${err} No post found`, next);
      // res.status(404).json({ postnotfound: 'No post found' })
    });
};

// Helpers
exports.deleteAllPosts = (req, res, next) => {
  Post.remove({})
    .then(posts => {
      if (!posts) {
        return errorHandler(404, `Could not delete posts!`, next);
      }
      return res.status(200).send(posts);
    })
    .catch(err => {
      return errorHandler(400, `${err}`, next);
    });
};
