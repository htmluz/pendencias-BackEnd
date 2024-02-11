const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AndamentosSchema = new Schema({
  id: {
    type: Number,
    required: false,
  },
  dateandamento: {
    type: Date,
    required: false,
  },
  user: {
    type: String,
    required: false,
  },
  andamento: {
    type: String,
    required: false,
  },
});

const PendenSchema = new Schema({
  id: {
    type: Number,
    required: false,
    unique: true,
  },
  complete: {
    type: Boolean,
    default: false,
  },
  titulo: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  tipo: {
    type: String,
    required: true,
  },
  responsavel: {
    type: String,
    required: true,
  },
  dateinit: {
    type: Date,
    required: true,
  },
  dateend: {
    type: Date,
    required: true,
  },
  dateatt: {
    type: Date,
    required: true,
  },
  taskid: {
    type: Number,
    required: false,
  },
  incidenturl: {
    type: String,
    required: false,
  },
  abertura: {
    user: {
      type: String,
      required: false,
    },
    dateopening: {
      type: Date,
      required: false,
    },
  },
  andamento: [AndamentosSchema],
  fechamento: {
    user: {
      type: String,
      required: false,
    },
    dateclosening: {
      type: Date,
      required: false,
    },
  },
  unidade: {
    type: String,
    default: "TIO",
  },
  massiva: {
    type: Boolean,
    default: false,
  },
});

const Pendencias = mongoose.model("Pendencia", PendenSchema);

module.exports = Pendencias;
