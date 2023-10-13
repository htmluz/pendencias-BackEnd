const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    pwd: {
        type: String,
        required: true
    },
    refreshtoken: {
        type: String,
        required: false
    }
})


const Usuarios = mongoose.model("Usuarios", UserSchema)

module.exports = Usuarios;