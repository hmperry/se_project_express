const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const {
  INTERNAL_SERVER_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  console.log("IN CONTROLLER");
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

// CREATE User
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  console.log(name, avatar, email, password);

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name: req.body.name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
    )
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(201).send(userObject);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "An error occurred from failed data validation." });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT_ERROR_CODE).send({
          message:
            "An error occurred. Someone with this email address already exists.",
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

// GET CURRENT USER
const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.send(userObject);
    })

    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "There is no item or user with the requested ID." });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "An error has occurred because of invalid data." });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

// Authenticate Users
const loginUser = (req, res) => {
  console.log("Is this working?");
  const { email, password } = req.body;

  if (email === undefined || password === undefined) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Email or password is missing." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log("User is in!");
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

// Update User Profile

const updateProfile = (req, res) => {
  console.log("Is this working?");
  // 1. Get user ID from req.user._id
  const { _id } = req.user;
  // 2. Get name and avatar from req.body
  const { name, avatar } = req.body;

  // 3. Use User.findByIdAndUpdate() with proper options
  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    // 5. Return the updated user
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(200).send(userObject);
    })
    // 4. Handle errors (Not Found, Validation, Server errors)
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "There is no item or user with the requested ID." });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "An error occurred from failed data validation." });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  loginUser,
  updateProfile,
};
