const googleController = require('../../controllers/google-controller');
const express = require('express');
const router = express.Router();
const passport = require("passport");
const jwt = require('jsonwebtoken');
const expiration = "2h";

require('dotenv').config();

const secret = process.env.PW_SECRET_HASH;

router.get('/auth', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, secret, { expiresIn: expiration });
    res.redirect(`https://localhost:3000/api/google/auth/callback?token=${token}`);
  }
);
module.exports = router;