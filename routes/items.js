const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/items");

router.get("/", getItems);

router.post("/", auth, createItem);

router.delete("/:itemId", auth, deleteItem);

router.put("/:itemId/likes", auth, likeItem);

router.delete("/:itemId/likes", auth, dislikeItem);
// router.patch("/:itemId/likes/add", auth, likeItem);
// router.patch("/:itemId/likes/dislike", auth, dislikeItem);
module.exports = router;
