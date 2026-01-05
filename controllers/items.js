const Item = require("../models/item");
const {
  INTERNAL_SERVER_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
} = require("../utils/errors");

// GET Items

const getItems = (req, res, next) => {
  console.log("IN CONTROLLER for ITEMS");
  Item.find({})
    .then((items) => {
      res.send(items);
    })
    .catch(next);
};

// Create Item

const createItem = (req, res) => {
  console.log("CONTROLLER CREATE NEW ITEMS");

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  console.log(name, weather, imageUrl);

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))

    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("An error occurred from failed data validation.")
        );
      } else if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

// DELETE Item by ID
const deleteItem = (req, res) => {
  console.log("CONTROLLER DELETE ITEM");
  const { itemId } = req.params;

  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        const error = new Error("Item not found");
        error.name = "NotFoundError";
        throw error;
      }

      if (item.owner.toString() !== req.user._id) {
        const error = new Error("Unauthorized User");
        error.name = "UnauthorizedUser";
        throw error;
      }
      return Item.findByIdAndDelete(itemId);
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFoundError") {
        return res.status(NOT_FOUND_ERROR_CODE).send({
          message: "There is no item or user with the requested ID.",
        });
      }

      if (err.name === "UnauthorizedUser") {
        return res.status(FORBIDDEN_ERROR_CODE).send({
          message: "Access is denied. Unauthorized user.",
        });
      }

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "An error has occurred because of invalid data.",
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

// Update Like
const likeItem = (req, res) => {
  console.log("CONTROLLER LIKE ITEM");
  const { itemId } = req.params;

  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "There is no item or uder with the requested ID." });
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

// Dislike Item
const dislikeItem = (req, res) => {
  console.log("CONTROLLER DISLIKE ITEM");
  const { itemId } = req.params;

  Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "There is no item or uder with the requested ID." });
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

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
