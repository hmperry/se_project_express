const router = require("express").Router();
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");
const { createUser, loginUser } = require("../controllers/users");

const {
  validateAuthentication,
  validateUserBody,
} = require("../middlewares/validation");
const userRouter = require("./users");
const itemRouter = require("./items");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.post("/signup", validateUserBody, createUser);

router.post("/signin", validateAuthentication, loginUser);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: "Route not found" });
});

module.exports = router;
