const Item = require("../models/item");

const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/not-found-err");
const UnauthorizedError = require("../errors/unauthorized-err");

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

const createItem = (req, res, next) => {
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
const deleteItem = (req, res, next) => {
  console.log("CONTROLLER DELETE ITEM");
  const { itemId } = req.params;

  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError(
          "There is no item or user with the requested ID."
        );
      }

      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError("You can only delete your own items.");
      }
      return Item.findByIdAndDelete(itemId);
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);

      if (err.name === "UnauthorizedUser") {
        next(new UnauthorizedError("Access is denied. Unauthorized user."));
      } else if (err.name === "CastError") {
        next(
          new BadRequestError("An error has occurred because of invalid data.")
        );
      } else {
        next(err);
      }
    });
};

// Update Like
const likeItem = (req, res, next) => {
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

// Dislike Item
const dislikeItem = (req, res, next) => {
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

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
