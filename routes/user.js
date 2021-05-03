const router = require("express").Router();


router.get("/", (req, res) => {
    res.json({ username: req.user.username })
});

module.exports = router;