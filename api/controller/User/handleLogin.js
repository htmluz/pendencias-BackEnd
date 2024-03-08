require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuarios = require("../../models/usuarios");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Usuário e senha são necessários." });
  const foundUser = await Usuarios.findOne({ user: user });
  const role = foundUser.roles;
  if (!foundUser) return res.sendStatus(401);
  const match = await bcrypt.compare(pwd, foundUser.pwd);
  if (match) {
    const accessToken = jwt.sign(
      { user: foundUser.user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
      { user: foundUser.user },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const insertRefreshToken = await Usuarios.findOneAndUpdate(
      { user: user },
      { refreshtoken: refreshToken }
    );
    insertRefreshToken.save();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("logged", "yes", {
      httpOnly: false,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); //top 10 implementacoes de manter login
    res.cookie("roles", role, {
      httpOnly: false,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = handleLogin;
