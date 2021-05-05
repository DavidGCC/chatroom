const Message = require("../models/Message");

const initMessages = async (req, res, next) => {
    try {
        const messages = await Message.find().sort({ "createdAt": 1 });
        req.app.locals.initMessages = messages;
        next(null);
    } catch (err) {
        console.log("error while fetching messages from db", err);
    }
}

module.exports = { initMessages };