const express = require("express");
const router = express.Router();
const verificarJWT = require("../middleware/verificarJWT");
const novoUsuario = require("../controller/User/newUser");
const handleLogin = require("../controller/User/handleLogin");
const handleRefreshToken = require("../controller/User/refreshToken");
const handleLogout = require("../controller/User/handleLogout");
const getUsuarios = require("../controller/User/getUsers");
const deleteUsuario = require("../controller/User/deleteUser");
const editUsuario = require("../controller/User/editUser");

router.post("/usuarios/new", novoUsuario);
router.post("/usuarios/auth", handleLogin);
router.get("/usuarios/refresh", handleRefreshToken);
router.get("/usuarios/logout", handleLogout);
router.get("/usuarios/get", getUsuarios);
router.put("/usuarios/edit/:name", verificarJWT, editUsuario);
router.delete("/usuarios/delete/:name", verificarJWT, deleteUsuario);

module.exports = router;
