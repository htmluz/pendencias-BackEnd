const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const TipoSchema = new Schema({
    tipo: {
        type: String,
        required: true
    }
});


const Tipos = mongoose.model("Tipos", TipoSchema)

module.exports = Tipos;