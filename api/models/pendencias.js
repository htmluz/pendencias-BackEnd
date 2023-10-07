const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PendenSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    titulo: {
        type: String,
        required: true
    },
    tipo: {
        type: String, 
        required: true
    },
    responsavel: {
        type: String,
        required: true
    },
    dateinit: {
        type: String,
        required: true
    },
    dateend: {
        type: String,
        required: true
    },
    dateatt: {
        type: String,
        required: true
    },
    datenow: {
        type: String,
        default: Date.now(),
        required: false
    },
    taskid: {
        type: Number,
        required: false
    },
    incidenturl: {
        type: String,
        required: false
    }
})

const Pendencias = mongoose.model("Pendencia", PendenSchema)

module.exports = Pendencias;