const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { findOrCreateUser } = require("./user-controller");

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

const googleCallbackURL =
  process.env.NODE_ENV === "production"
    ? "https://onlydevs-504c5476d7ee.herokuapp.com/api/google/auth/callback"
    : "http://localhost:3001/api/google/auth/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: googleCallbackURL,
      scope: ["profile", "email"],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {

        const authData = {
          googleId: profile.id,
          name: profile.displayName,
          username: profile.emails[0].value,
          email: profile.emails[0].value,
          googleAccessToken: accessToken,
          googleRefreshToken: refreshToken,
          password: "GOOGLE_SIGNED_IN_USER",
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
