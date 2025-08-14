const User = require("../models/user");
const {
  BAD_REQUEST_VALIDATION_ERROR,
  BAD_REQUEST_SERVER_ERROR,
  BAD_REQUEST_INVALID_USER_ID,
  BAD_REQUEST_DOCUMENT_NOT_FOUND,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  console.log("IN CONTROLLER");
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(BAD_REQUEST_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// CREATE User
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(name, avatar);

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_VALIDATION_ERROR)
          .send({ message: "An error occurred from failed data validation." });
      }
      return res
        .status(BAD_REQUEST_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// GET User by ID
const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))

    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(BAD_REQUEST_DOCUMENT_NOT_FOUND)
          .send({ message: "There is no item or uder with the requested ID." });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_INVALID_USER_ID)
          .send({ message: "An error has occurred because of invalid data." });
      }
      return res
        .status(BAD_REQUEST_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getUserById };
