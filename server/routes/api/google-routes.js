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
    console.log('Inside /auth/callback route'); // Add this line
    passport.authenticate('google', { failureRedirect: '/' })(req, res, next);
  },
  (req, res) => {
    console.log('Inside callback handler'); // Add this line
    const token = jwt.sign({ userId: req.user.id }, secret, { expiresIn: expiration });
    res.redirect(`http://localhost:3000/api/google/auth/callback?token=${token}`);
  }
);
module.exports = router;