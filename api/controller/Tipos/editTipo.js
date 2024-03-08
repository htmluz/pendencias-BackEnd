const Tipos = require("../../models/tipos");

const editTipo = async (req, res) => {
  const stipo = req.body.tipo.replace(/\s+$/, "");
  const tipoToEdit = await Tipos.findOneAndUpdate(
    { tipo: req.params.tipo },
    { $set: { tipo: stipo } }
  );
  res.json(tipoToEdit);
};

module.exports = editTipo;
