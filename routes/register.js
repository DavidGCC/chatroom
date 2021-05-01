const router = require("express").Router();


router.get("/", (req, res) => {
    res.render(`${process.cwd()}/views/pug/register.pug`, { title: "Chatroom | Register" });
});


module.exports = router