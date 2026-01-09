const router = require("express").Router();
const NotFoundError = require("../errors/not-found-err");
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

router.use((req, res, next) => {
  next(new NotFoundError("This page is not found."));
});

module.exports = router;
