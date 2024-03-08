const Pendencias = require("../../models/pendencias");
const moment = require("moment-timezone");

const newAndamento = async (req, res) => {
  try {
    const novoAndamento = {
      id: req.body.andamento.id,
      dateandamento: moment().tz("America/Sao_Paulo"),
      user: req.body.andamento.user,
      andamento: req.body.andamento.andamento,
    };
    const andamento = await Pendencias.findOneAndUpdate(
      { id: req.params.id },
      { $push: { andamento: novoAndamento } }
    );
    res.json(andamento);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = newAndamento;
