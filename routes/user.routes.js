var express = require("express");
var router = express.Router();
const axios = require("axios").default;

//models
const Snippet = require("../models/Snippet.model");

// require auth middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

//--------------------------------------------------------------- DASHBOARD
router.get("/dashboard", isLoggedIn, (req, res) => {
  console.log(req.session);
  axios
    .get("https://programming-quotes-api.herokuapp.com/Quotes/random")
    .then((response) => {
      console.log(response.data);
      res.render("dashboard", {
        userInSession: req.session.currentUser,
        quote: response.data,
      });
    })
    .catch((err) => console.log(err));
});
//--------------------------------------------------------------- SNIPPETS
//GET snippets page
router.get("/snippets", isLoggedIn, (req, res) => {
  Snippet.find({ uid: req.session.currentUser._id })
    .then((data) => {
      console.log(data), res.render("snippets", { data });
    })
    .catch((err) => console.log(err));
});
//GET create snippets page
router.get("/snippets/create", isLoggedIn, (req, res) => {
  res.render("create-snippet");
});
//POST create snippets page
router.post("/snippets/create", isLoggedIn, (req, res) => {
  const { name, sid, label, code, lang } = req.body;
  console.log(name, sid, label, code, lang);

  const newSnip = new Snippet({
    name: name,
    sid: sid,
    label: label,
    code: code,
    lang: lang,
    uid: req.session.currentUser._id,
  });

  newSnip
    .save()
    .then(res.redirect("/user/snippets"))
    .catch((err) => console.log(err));
  res.send("ITS WORKING YALL");
});
//POST delete route
router.post("/snippets/:sid/delete", isLoggedIn, (req, res) => {
  Snippet.findOneAndDelete({ sid: req.params.sid })
    .then(res.redirect("/user/snippets"))
    .catch((err) => console.log(err));
});
//--------------------------------------------------------------- BOOKS
//GET books page
router.get("/books", isLoggedIn, (req, res) => {
  axios
    .get("https://api.itbook.store/1.0/new")
    .then((response) => {
      let books = response.data.books;
      console.log(books);
      res.render("books", { books });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
