const axios = require("axios");
const dotenv = require("dotenv");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const getUserData = async (accessToken) => {
  try {
    const { data } = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    return null;
  }
};

async function verifyGoogleToken(idToken) {
  try {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      const googleData = response.data;

      if (googleData.aud !== process.env.GOOGLE_CLIENT_ID) {
          throw new Error('Invalid audience (aud) claim.');
      }

      return googleData;
  } catch (error) {
      throw new Error('Token verification failed.');
  }
};

const User = require('../models/User'); // Your user model

async function findOrCreateUser(googleData) {
    let user = await User.findOne({ email: googleData.email });

    if (!user) {
        user = new User({
            googleId: googleData.sub,
            email: googleData.email,
            name: googleData.name,
        });

        await user.save();
    }

    return user;
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user);
  } catch (err) {
      done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: 'https://www.example.com/oauth2/redirect/google',
  scope: ['profile', 'email']
},

async (accessToken, refreshToken, profile, cb) => {
  try {
      const googleData = {
          sub: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName
      };
      
      const user = await findOrCreateUser(googleData);
      
      return cb(null, user);
  } catch (err) {
      return cb(err, null);
  }
}));


module.exports = {
  getUserData, verifyGoogleToken, findOrCreateUser
};
