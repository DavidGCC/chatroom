// Library IMPORTs
require("dotenv").config();
const express = require("express");

// file IMPORTs
const registerRouter = require("./routes/register");

const app = express();

app.set("view engine", "pug");
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/register", registerRouter);

app.get("/", (req, res) => {
    res.render(`${process.cwd()}/views/pug/index.pug`, { title: "Chatroom", showLogin: true });
});


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});