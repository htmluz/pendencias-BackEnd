const bcrypt = require("bcrypt");
const Usuarios = require("../../models/usuarios");

const novoUsuario = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Usuário e senha são necessários." });
  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = new Usuarios({
      user: req.body.user,
      pwd: hashedPwd,
      roles: req.body.roles,
    });
    const saveuser = await newUser.save();
    res.status(201).json({ "success:": `Novo usuario ${user} criado` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = novoUsuario;
