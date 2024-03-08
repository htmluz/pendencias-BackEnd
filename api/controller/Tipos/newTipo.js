const Tipos = require("../../models/tipos");

const newTipo = async (req, res) => {
  const stipo = req.body.tipo.replace(/\s+$/, "");
  const tipos = new Tipos({
    tipo: stipo,
  });

  const savetipo = await tipos.save();
  res.json(tipos);
};

module.exports = newTipo;
