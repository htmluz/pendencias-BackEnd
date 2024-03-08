const Tipos = require("../../models/tipos");

const deleteTipo = async (req, res) => {
  const tipoToDelete = await Tipos.findOneAndDelete({ tipo: req.params.tipo });
  res.status(200);
  res.json(tipoToDelete);
};

module.exports = deleteTipo;
