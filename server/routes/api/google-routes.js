const express = require('express');
const router = express.Router();
const passport = require("passport");
const jwt = require('jsonwebtoken');
const expiration = "2h";

require('dotenv').config();

const secret = process.env.PW_SECRET_HASH;

router.get('/auth', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
});

router.get('/auth/callback', 
  (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/' })(req, res, next);
  },
  (req, res) => {
    const { email, username, _id, name, googleAccessToken, googleRefreshToken } = req.user;
    
    const payload = {
      email,
      username,
      _id,
      name,
      googleAccessToken,
      googleRefreshToken
    };
    
    const token = jwt.sign({ authenticatedPerson: payload }, secret, { expiresIn: expiration });
    res.redirect(`http://localhost:3000/api/google/auth/callback?token=${token}`);
  }
);
module.exports = router;