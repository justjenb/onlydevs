const passport = require("passport");
var DiscordStrategy = require('passport-discord').Strategy;
const User = require("../models/User");
const { findOrCreateUser } = require('./user-controller');

var scopes = ['identify', 'email', 'guilds', 'guilds.join'];

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

const discordCallbackURL =
  process.env.NODE_ENV === "production"
    ? "https://onlydevs-504c5476d7ee.herokuapp.com/api/discord/auth/callback"
    : "http://localhost:3001/api/discord/auth/callback";

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: discordCallbackURL,
      scope: scopes
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        
        const authData = {
          discordId: profile.id,
          name: profile.name,
          username: profile.username,
          email: profile.email,
          discordUsername: profile.login,
          discordAccessToken: accessToken,
          discordRefreshToken: refreshToken,
          password: "DISCORD_SIGNED_IN_USER",
        };
        
        const user = await findOrCreateUser(profile.email, authData);

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
