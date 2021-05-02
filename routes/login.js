const router = require("express").Router();
const passport = require("passport");

router.post("/", passport.authenticate("local", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/chat")
});


module.exports = router;