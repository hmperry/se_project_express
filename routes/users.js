const router = require("express").Router();
const {
  getCurrentUser,
  updateProfile,
  createUser,
  loginUser,
} = require("../controllers/users");
const { auth } = require("../middlewares/auth");

// router.get("/", getUsers);
router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateProfile);

module.exports = router;
