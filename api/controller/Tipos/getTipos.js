const Tipos = require("../../models/tipos");

const getTipos = async (req, res) => {
  const tipos = await Tipos.find();
  res.json(tipos);
};

module.exports = getTipos;
