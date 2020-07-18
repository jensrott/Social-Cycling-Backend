const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const saltRounds = 10;

const validateRegisterInput = require("../validators/register");
const validateLoginInput = require("../validators/login");

require("dotenv").config();

// @route: POST http://localhost:3001/api/v1/users/register
// @desc: Create a new user (register)
// @access: Public
exports.registerUser = (req, res) => {
  console.log(req.body);
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).send(errors);
  }

  User.findOne({ email: req.body.registerEmail }).then(user => {
    if (user) {
      return res.status(400).send({ registerEmail: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.registerEmail, {
        s: "200",
        r: "pg",
        d: "mm" // Default
      });
      const newUser = new User({
        name: req.body.registerName,
        email: req.body.registerEmail,
        password: req.body.registerPassword,
        repeatPassword: req.body.registerRepeatPassword
      });
      // Hash the password before saving in database
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.json(user);
            })
            .catch(err => {
              console.log(err);
            });
        });
      });
    }
  });
};

// @route: POST http://localhost:3001/api/v1/users/login
// @desc: Login a new user (Get token)
// @access: Public
exports.loginUser = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).send(errors);
  }

  const email = req.body.loginEmail.toLowerCase();
  const password = req.body.loginPassword;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res
        .status(404)
        .send({ loginEmail: "No user found with this email!" });
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture
          };

          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
              expiresIn: 31556926
            },
            (err, token) => {
              if (err) {
                res.status(400).send(err);
              }
              res.json({
                succes: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res
            .status(400)
            .send({ loginPassword: "Password not correct!" });
        }
      });
    }
  });
};

exports.updateProfilePicture = (req, res) => {
  const profilePicture = req.file.filename;
  console.log(profilePicture);

  User.findOneAndUpdate(
    {
      _id: req.user.id
    },
    {
      $currentDate: {
        updated_at: true
      },
      $set: {
        profilePicture: profilePicture
      }
    },
    {
      new: true
    }
  ).then((user, err) => {
    if (err) {
      return res
        .status(400)
        .send({ invalidFile: "You cannot upload this kind of file!" });
    }
    return res.json(user);
  });
};

exports.loginFacebook = async (req, res) => {
  try {
    res.send("Facebook login");
  } catch (error) {
    res.status(400).send(error);
  }
};

// Helpers
exports.deleteAllUsers = async (req, res) => {
  try {
    let result = await User.remove({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send(err);
  }
};
