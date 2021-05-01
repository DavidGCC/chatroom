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
        const response = await User.findById(id);
        done(null, response);
    });

    passport.use(new LocalStrategy(async (username, password, done) => {
        User.findOne({ username: username }, async (err, user) => {
            console.log(`User ${username} attempted to login`);
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            console.log(password, user.password);
            const match = await bcrypt.compare(password, user.password);
            if (!match) { return done(null, false); }
            return done(null, user);
        });
    }));
}