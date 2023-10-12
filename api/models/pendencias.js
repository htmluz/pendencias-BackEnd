const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Andamentos = new Schema({
    id: {
       type: Number,
       required: true 
    },
    dateandamento: {
        type: String,
        default: Date.now(),
        required: false
    },
    user: {
        type: String,
        required: true
    }
})


const PendenSchema = new Schema({
    id: {
        type: Number,
        required: false,
        unique: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    titulo: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: false
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
    taskid: {
        type: Number,
        required: false
    },
    incidenturl: {
        type: String,
        required: false
    },
    abertura: {
        user: {
            type: String,
            required: false,
        },
        dateopening: {
            type: String,
            default: Date.now(),
            required: false
        }
    },
    // andamento: [Andamentos],
    fechamento: {
        user: {
            type: String,
            required: false, 
        },
        dateclosening: {
            type: String,
            default: Date.now(),
            required: false
        }
    }
})


const Pendencias = mongoose.model("Pendencia", PendenSchema)

module.exports = Pendencias;