const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: "689cdfc170856f64be45ab6c",
  };
  next();
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);
app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
