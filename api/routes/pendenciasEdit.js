const express = require("express");
const router = express.Router();
const verificarJWT = require("../middleware/verificarJWT");
const newAndamento = require("../controller/Pendencias/newAndamento");
const newPendencia = require("../controller/Pendencias/newPendencia");
const editPendencia = require("../controller/Pendencias/editPendencia");
const completePendencia = require("../controller/Pendencias/completePendencia");

router.post("/pendencias/new", verificarJWT, newPendencia);
router.put("/pendencias/complete/:id", verificarJWT, completePendencia);
router.put("/pendencias/edit/:id", verificarJWT, editPendencia);
router.put("/pendencias/andamento/:id", verificarJWT, newAndamento);

module.exports = router;
