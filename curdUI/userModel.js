const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/crud", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

//will create a collection called users with the above schema
const usermodel = mongoose.model("User", userSchema);

module.exports = usermodel;