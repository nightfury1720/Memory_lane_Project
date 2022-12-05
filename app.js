const express = require("express");
const morgan = require("morgan");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
//dotenv.config({ path: "./config.env" });
const cors = require("cors");
const cookieParser = require("cookie-parser");
//const mongoose = require("mongoose");
const AppError = require("./utils/appError.js");
const errorHandler = require("./controllers/errorController1");
const userRouter = require("./routes/userRoutes.js");
const postRouter = require("./routes/postRoutes.js");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.options("*", cors());

app.use(helmet());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
//CORS Request

app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`No url found found for ${req.url}`, 404));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("/client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use(errorHandler);
module.exports = app;
