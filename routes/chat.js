const router = require("express").Router();


router.get("/", (req, res) => {
    res.render(`${process.cwd()}/views/pug/chat.pug`);
});

module.exports = router;