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

const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/not-found-err");
const UnauthorizedError = require("../errors/unauthorized-err");
// const InternalServerError = require("../errors/internal-server-err");

// CREATE User
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  console.log(name, avatar, email, password);

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name: name,
        avatar: avatar,
        email: email,
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
        next(
          new BadRequestError("An error occurred from failed data validation.")
        );
      } else if (err.code === 11000) {
        next(
          new ConflictError(
            "An error occurred. Someone with this email address already exists."
          )
        );
      } else {
        next(err);
      }
    });
};

// GET CURRENT USER
const getCurrentUser = (req, res, next) => {
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
        next(
          new NotFoundError("There is no item or user with the requested ID.")
        );
      } else if (err.name === "CastError") {
        next(
          new BadRequestError("An error has occurred because of invalid data.")
        );
      } else {
        next(err);
      }
    });
};

// Authenticate Users
const loginUser = (req, res, next) => {
  console.log("Is this working?");
  const { email, password } = req.body;

  if (email === undefined || password === undefined) {
    throw new BadRequestError("Email or password is missing.");
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
        next(new UnauthorizedError(err.message));
      } else {
        next(err);
      }
    });
};

// Update User Profile

const updateProfile = (req, res, next) => {
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
        next(
          new NotFoundError("There is no item or user with the requested ID.")
        );
      } else if (err.name === "ValidationError") {
        next(
          new BadRequestError("An error occurred from failed data validation.")
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  loginUser,
  updateProfile,
};
