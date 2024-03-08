const Usuarios = require("../../models/usuarios");

const deleteUsuario = async (req, res) => {
  const userToDelete = await Usuarios.findOneAndDelete({
    user: req.params.name,
  });
  res.status(200);
  res.json(userToDelete);
};

module.exports = deleteUsuario;
