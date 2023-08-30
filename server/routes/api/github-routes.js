const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require('jsonwebtoken');
const expiration = "2h";

require('dotenv').config();

const secret = process.env.PW_SECRET_HASH;

router.get("/auth", passport.authenticate("github", { 
  scope: ['user', 'user:email'] 
}));

router.get("/auth/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function (req, res) {
    const token = jwt.sign({ userId: req.user.id }, secret, { expiresIn: expiration });
    res.redirect(`http://localhost:3000/api/github/auth/callback?token=${token}`);  }
);

module.exports = router;
