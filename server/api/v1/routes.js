const express = require("express");
const router = express.Router();

const postController = require("./controllers/postController");
const authController = require("./controllers/authController");
const profileController = require("./controllers/profileController");

const passport = require("passport");
const verifyToken = require('./middlewares/verifyToken');
const upload = require('./middlewares/multerMiddleware');


const profileSeeder = require('./db/seeder');

// api/v1
router.get("/", (req, res) => {
  res.send(`Welcome to the api!`);
});

/* Authentication */

// api/v1/users
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.post("/user/picture", verifyToken, upload.single('profilePicture'), authController.updateProfilePicture)

/* Only logged in users can see these routes */

router.delete("/users", verifyToken, authController.deleteAllUsers);

/* Posts */

// api/v1/posts
router.get("/posts", postController.getAllPosts);
router.post("/posts", verifyToken, postController.createPost);
router.get("/post/:id", verifyToken, postController.getPostById);
router.get("/post/:profile_pic", verifyToken, postController.getProfileFromProfilePicture);
router.get("/post/profile/:id", verifyToken, postController.getProfileFromPost);
router.patch("/post/:id", verifyToken, postController.updatePostById);
router.delete("/post/:id", verifyToken, postController.deletePostById);
router.delete("/posts", verifyToken, postController.deleteAllPosts);
router.post("/post/like/:id", verifyToken, postController.likePost);
router.delete("/post/unlike/:id", verifyToken, postController.unlikePost);
router.post("/post/comment/:id", verifyToken, postController.addComment);
router.delete("/post/comment/:id/:comment_id", verifyToken, postController.removeComment);

/* Profiles */

// api/v1/profiles
router.get("/profile", verifyToken, profileController.getCurrentProfile);
router.get("/profiles", verifyToken, profileController.getAllProfiles);
router.get("/profile/user/:user_id", verifyToken, profileController.getProfileByUserId);
router.get("/profile/user/posts/:user_id", verifyToken, profileController.getPostsFromProfileByUserId);
router.get("/profile/username/:username", verifyToken, profileController.getProfileByUsername);
router.post("/profile", verifyToken, profileController.createOrUpdateProfile);
router.delete("/profile", verifyToken, profileController.deleteCurrentProfile);
router.delete("/profiles", verifyToken, profileController.deleteAllProfiles);

// api/v1/seeder/profiles
router.get('/seeder/profiles', profileSeeder.seedProfiles);

module.exports = router;
