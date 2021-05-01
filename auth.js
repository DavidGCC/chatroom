const passport = require("passport");
const ObjectID = require("mongoose").ObjectID;
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const User = require("./models/User");

module.exports = (app) => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        User.findById(id, (err, user) => {
            done(null, {
                _id: user._id,
                username: user.username
            });
        });
    });

    passport.use(new LocalStrategy(async (username, password, done) => {
        User.findOne({ username: username }, async (err, user) => {
            console.log(`User ${username} attempted to login`);
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            const match = await bcrypt.compare(password, user.password);
            if (!match) { return done(null, false); }
            return done(null, {
                _id: user._id,
                username: user.username
            });
        });
    }));
}