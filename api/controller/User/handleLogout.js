require("dotenv").config();
const Usuarios = require("../../models/usuarios");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  const deleteToken = await Usuarios.findOneAndUpdate(
    { refreshtoken: refreshToken },
    { $set: { refreshtoken: "" } }
  );
  deleteToken.save();
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  return res.sendStatus(204);
};

module.exports = handleLogout;
