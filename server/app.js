/* eslint-disable no-console */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const usersRouter = require("./routes/users.route");
const institutesRouter = require("./routes/institutes.route");
const rootRouter = require("./routes/root.route");

const app = express();
const { PORT, MONGO_URI } = process.env;

// Server configs
app.disable("x-powered-by");

// Simulate slow connection
app.use((req, res, next) => {
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => next());
});

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

// Routes
app.use("/", rootRouter);
app.use("/users", usersRouter);
app.use("/institutes", institutesRouter);

// 404 handler
app.use((req, res, _next) => {
  res.status(404).send({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, _next) => {
  const { status, message } = err;
  console.log({ message, ...err });
  res.status(status || 500).send({ message, ...err });
});

// Suppress deprecation warning
mongoose.set("strictQuery", false);

// Mongoose event handlers
const conn = mongoose.connection;
conn.on("connecting", () => {
  console.log("Connecting to DB...");
});
conn.on("connected", () => {
  console.log("Connected to DB.");
});
conn.on("error", (e) => {
  console.error(e);
});
// Connect to db
mongoose.connect(MONGO_URI);

// Start express server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
