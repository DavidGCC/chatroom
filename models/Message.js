const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    message: { type: String }
}, { timestamps: { createdAt: "createdAt" } });

messageSchema.set("toJSON", {
    transform: (doc, returned) => {
        returned.id = returned._id.toString();
        delete returned._id;
        delete returned.__v;
    }
});


module.exports = new mongoose.model("Message", messageSchema);