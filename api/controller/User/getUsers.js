const Usuarios = require("../../models/usuarios");

const getUsuarios = async (req, res) => {
  const users = await Usuarios.find();
  res.json(users);
};

module.exports = getUsuarios;
