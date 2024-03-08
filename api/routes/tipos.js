const express = require("express");
const router = express.Router();
const verificarJWT = require("../middleware/verificarJWT");
const newTipo = require("../controller/Tipos/newTipo");
const getTipos = require("../controller/Tipos/getTipos");
const deleteTipo = require("../controller/Tipos/deleteTipo");
const editTipo = require("../controller/Tipos/editTipo");

router.post("/tipos/new", verificarJWT, newTipo);
router.get("/tipos/get", verificarJWT, getTipos);
router.delete("/tipos/delete/:tipo", verificarJWT, deleteTipo);
router.put("/tipos/edit/:tipo", verificarJWT, editTipo);

module.exports = router;
