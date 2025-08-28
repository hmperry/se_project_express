const router = require("express").Router();
const {
  getUsers,
  createUser,
  loginUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");
const { auth } = require("../middleware/auth");

// router.get("/", getUsers);
router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateProfile);

// router.post("/signup", createUser);

// router.post("/signin", loginUser);

module.exports = router;
