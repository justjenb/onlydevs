const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require("dotenv");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://localhost:3001/api/google/auth/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            try {
                user = new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    password: 'GOOGLE_SIGNED_IN_USER'
                });
                await user.save();
            } catch (error) {
                if (error.code === 11000) { // Duplicate key error
                    // This block will handle the duplicate key error, you can adjust the logic as needed
                    user = await User.findOne({ username: profile.displayName });
                    if (!user) {
                        return done(new Error('Failed to handle duplicate username'));
                    }
                } else {
                    return done(error); // Handle other errors as necessary
                }
            }
        }

        done(null, user);
    })
);
