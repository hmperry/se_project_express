const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { validateId, validateCardBody } = require("../middlewares/validation");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/items");

router.get("/", getItems);

router.post("/", auth, validateCardBody, createItem);

router.delete("/:itemId", auth, validateId, deleteItem);

router.put("/:itemId/likes", auth, validateId, likeItem);

router.delete("/:itemId/likes", auth, validateId, dislikeItem);
// router.patch("/:itemId/likes/add", auth, likeItem);
// router.patch("/:itemId/likes/dislike", auth, dislikeItem);
module.exports = router;
