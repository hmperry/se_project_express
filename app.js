const cors = require("cors");
const express = require("express");

const mongoose = require("mongoose");
const helmet = require("helmet");
const { limiter } = require("./utils/rateLimiter");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;
app.use(limiter);
app.use(helmet());
app.use(cors());
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch(console.error);
app.use(express.json());
app.use("/", mainRouter);
