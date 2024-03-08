const Pendencias = require("../../models/pendencias");

const completaPendencia = async (req, res) => {
  const pendencia = await Pendencias.findOne({ id: req.params.id });
  pendencia.complete = true;
  pendencia.fechamento.user = req.body.fechamento.user;
  pendencia.fechamento.dateclosening = req.body.fechamento.dateclosening;
  pendencia.save();
  res.json(pendencia);
};

module.exports = completaPendencia;
