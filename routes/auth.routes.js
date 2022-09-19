var express = require("express");
var router = express.Router();
const axios = require("axios").default;

//password encryption
const bcrypt = require("bcryptjs");

//models
const User = require("../models/User.model");

// require auth middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

//--------------------------------------------------------------- LOGIN PAGES
//GET login
router.get("/login", function (req, res, next) {
  res.render("login");
});
//POST login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  let errors = [];

  if (!username || !password) {
    errors.push({ msg: "All fields are required" });
  }

  if (errors.length > 0) {
    res.render("login", {
      errors,
      username,
      password,
    });
  } else {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          req.flash(
            "errorMessage",
            "Could not find an account with that username"
          );
          res.redirect("/auth/login");
          return;
        } else if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.redirect("/user/dashboard");
        } else {
          req.flash("errorMessage", "Incorrect password");
          res.redirect("/auth/login");
        }
      })
      .catch((error) => next(error));
  }
  console.log("SESSION =====> ", req.session);
});
//--------------------------------------------------------------- RESGISTER PAGES
// GET register
router.get("/register", (req, res) => {
  res.render("register");
});
//POST register
router.post("/register", (req, res) => {
  const { name, username, password, password2 } = req.body;
  let errors = [];

  //error checks
  if (!name || !username || !password || !password2) {
    errors.push({ msg: "All fields are required" });
  }
  if (password !== password2) {
    errors.push({ msg: "Password and Password Confirmation do not match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password needs to be at least 6 characters long" });
  }

  //handle errors
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      username,
      password,
      password2,
    });
  } else {
    User.findOne({ username: username }).then((user) => {
      //check if user already exists with the provided username
      //if not, create user and render the login screen
      if (user) {
        errors.push({
          msg: "Account already exists with provided username",
        });
        res.render("register", {
          errors,
          name,
          username,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          username,
          password,
        });

        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash("successMessage", "Registration Successful");
                res.redirect("/auth/login");
              })
              .catch((err) => {
                console.log(err);
              });
          })
        );
      }
    });
  }
});

//--------------------------------------------------------------- RESGISTER PAGES
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
