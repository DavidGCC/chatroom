const router = require("express").Router();

const ensureAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect("/");
    }
}

router.get("/", ensureAuth, (req, res) => {
    res.render(`${process.cwd()}/views/pug/chat.pug`, { title: "Chatroom" });
});

module.exports = router;