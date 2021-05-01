const mongoose = require('mongoose');
const mongoUnique = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
userSchema.plugin(mongoUnique);

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = new mongoose.model("User", userSchema);