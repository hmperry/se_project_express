const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const { validateUserUpdateBody } = require("../middlewares/validation");

// router.get("/", getUsers);
router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, validateUserUpdateBody, updateProfile);

module.exports = router;
