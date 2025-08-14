const router = require("express").Router();
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");

const userRouter = require("./users");
const itemRouter = require("./items");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: "Route not found" });
});

module.exports = router;
