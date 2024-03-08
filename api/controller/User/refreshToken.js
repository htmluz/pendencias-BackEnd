require("dotenv").config();
const jwt = require("jsonwebtoken");
const Usuarios = require("../../models/usuarios");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = await Usuarios.findOne({ refreshtoken: refreshToken });
  if (!foundUser) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.user !== decoded.user) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { user: decoded.user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );
    res.json({ accessToken });
  });
};

module.exports = handleRefreshToken;
