/** Express app for jobly. */

const express = require("express");
const morgan = require("morgan");

const ExpressError = require("./helpers/expressError");
const { authenticateJWT } = require("./middleware/auth");
const jwt = require("jsonwebtoken");

const app = express();

const companiesRoutes = require("./routes/companies");
const jobsRoutes = require("./routes/jobs");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth")

app.use(express.json());
// add logging system
app.use(morgan("tiny"));
app.use(authenticateJWT);

// now our routes
app.use("/companies", companiesRoutes);
app.use("/jobs", jobsRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);


/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message
  });
});


module.exports = app;
