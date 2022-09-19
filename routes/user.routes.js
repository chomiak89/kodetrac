var express = require("express");
var router = express.Router();
const axios = require("axios").default;

//--------------------------------------------------------------- DASHBOARD
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

module.exports = router;
