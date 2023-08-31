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
    const { email, githubUsername, _id, name, username, githubAccessToken, githubRefreshToken } = req.user;
    
    const payload = {
      email,
      githubUsername,
      _id,
      name,
      username,
      githubAccessToken,
      githubRefreshToken
    };
    
    const token = jwt.sign({ authenticatedPerson: payload }, secret, { expiresIn: expiration });
    res.redirect(`http://localhost:3000/api/github/auth/callback?token=${token}`);
  }
);

module.exports = router;