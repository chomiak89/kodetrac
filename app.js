require("dotenv/config");

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const axios = require("axios").default;

var app = express();

// ℹ️ Connects to the database
require("./db");

// view engine setup
app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//----- SESSIONS
require("./config/session.config")(app);

//----- FLASH
app.use(flash());

//----- GLOBAL MESSAGES
app.use((req, res, next) => {
  res.locals.successMessage = req.flash("successMessage");
  res.locals.errorMessage = req.flash("errorMessage");
  res.locals.error = req.flash("error");
  next();
});

//REQUIRE ROUTES
const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

//ROUTES
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
