const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const TipoSchema = new Schema({
    tipo: {
        type: string,
        required: true,
        unique: true
    }
})


const Tipos = mongoose.model("Tipos", TipoSchema)

module.exports = Tipos;