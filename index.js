// Library IMPORTs
require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const passport = require('passport');
const session = require("express-session");

// file IMPORTs
const auth = require("./auth");

// ROUTERS
const registerRouter = require("./routes/register");
const chatRouter = require("./routes/chat");

const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log("Connected To Database"))
    .catch(err => console.log("Error While Connecting", err))

app.set("view engine", "pug");
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true },
}));
app.use(passport.initialize());
app.use(passport.session());
auth(app);

// ROUTES
app.use("/register", registerRouter);
app.use("/chat", chatRouter);

app.get("/", (req, res) => {
    res.render(`${process.cwd()}/views/pug/index.pug`, { title: "Chatroom", showLogin: true });
});


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});