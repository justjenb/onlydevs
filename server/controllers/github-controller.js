const passport = require("passport");
const GitHubStrategy = require("passport-github-oauth20").Strategy;
const User = require("../models/User");
const { findOrCreateUser } = require('./user-controller'); // Import the findOrCreateUser function

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

const githubCallbackURL =
  process.env.NODE_ENV === "production"
    ? "https://onlydevs-504c5476d7ee.herokuapp.com/api/github/auth/callback"
    : "http://localhost:3001/api/github/auth/callback";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: githubCallbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        
        const authData = {
          githubId: profile.id,
          name: profile.name,
          username: profile.username,
          email: profile.email,
          githubUsername: profile.username,
          githubAccessToken: accessToken,
          githubRefreshToken: refreshToken,
          password: "GITHUB_SIGNED_IN_USER",
        };

        const user = await findOrCreateUser(profile.emails[0].value, authData);

        done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
