// Library IMPORTs
require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require("connect-flash");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cookieParser = require("cookie-parser");
const passportSocketio = require("passport.socketio");
const MongoStore = require("connect-mongo");
const store = MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI,
    autoRemove: "interval",
    autoRemoveInterval: 15
});

// file IMPORTs
const auth = require("./auth");

// ROUTERS
const registerRouter = require("./routes/register");
const chatRouter = require("./routes/chat");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const userRouter = require("./routes/user");

// MODELS
const Message = require("./models/Message");


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log("Connected To Database"))
    .catch(err => console.log("Error While Connecting", err))

app.set("view engine", "pug");
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    key: "connect.sid",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
    store: store,
}));
app.use(flash());
auth(app);

// ROUTES
app.use("/register", registerRouter);
app.use("/chat", chatRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/user", userRouter);

// SOCKET
const onAuthorizeSuccess = (data, accept) => accept(null, true);
const onAuthorizeFail = (data, message, error, accept) => {
    if (error) throw new Error(message);
    console.log("Failed connection to socketio", message);
    accept(null, false);
}

io.use(passportSocketio.authorize({
    cookieParser,
    secret: process.env.SESSION_SECRET,
    key: "connect.sid",
    store: store,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
}));

let userCount = 0;
io.sockets.on("connection", async (socket) => {
    console.log(`User ${socket.request.user.username} Connected to Chatroom.`);
    userCount++;
    io.emit("user", {
        username: socket.request.user.username,
        connected: true,
        userCount
    });

    try {
        const messages = await Message.find().sort({ "createdAt": 1 });
        socket.emit("init messages", messages);
    } catch(err) {
        console.log("Error while initialising messages", err);
    }

    socket.on("disconnect", () => {
        userCount--;
        io.emit("user", {
            connected: false,
            userCount,
            username: socket.request.user.username
        })
    });

    socket.on("message", async (data) => {
        try {
            const newMessage = new Message({
                sender: socket.request.user.username,
                message: data,
            });
            
            await newMessage.save();
            
            socket.broadcast.emit("message", {
                username: socket.request.user.username,
                message: data
            });
        } catch (err) {
            console.log("error while saving and emiting message");
        }
    });
});


app.get("/", (req, res) => {
    res.render(`${process.cwd()}/views/pug/index.pug`, { title: "Chatroom", showLogin: true, error: req.flash("error") });
});


server.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});