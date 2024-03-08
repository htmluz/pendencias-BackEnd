const bcrypt = require("bcrypt");
const Usuarios = require("../../models/usuarios");

const editUsuario = async (req, res) => {
  if (req.body.pwd === "") {
    const userEdit = await Usuarios.findOneAndUpdate(
      { user: req.params.name },
      { $set: { roles: req.body.roles } }
    );
    userEdit.save();
    res.json(userEdit);
  } else {
    const { pwd } = req.body;
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const userEdit = await Usuarios.findOneAndUpdate(
      { user: req.params.name },
      { $set: { pwd: hashedPwd, roles: req.body.roles } }
    );
    userEdit.save();
    res.json(userEdit);
  }
};

module.exports = editUsuario;
