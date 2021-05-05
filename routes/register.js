const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/User");


router.get("/", (req, res) => {
    res.render(`${process.cwd()}/views/pug/register.pug`, { title: "Chatroom | Register", error: req.flash("error") });
});

router.post("/", async (req, res, next) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    try {
        const newUser = new User({ username, password: hash });
        const response = await newUser.save();
        next(null, response);
    } catch (err) {
        console.log("Error While Registering", err);
        req.flash("error", `Username ${username} already taken`);
        res.redirect("/register");
    }
}, passport.authenticate("local", { failureRedirect: "/" }), (req, res) => res.redirect("/chat"));


module.exports = router