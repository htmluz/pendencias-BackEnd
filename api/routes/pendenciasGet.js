const express = require("express");
const router = express.Router();
const getPendencias = require("../controller/Pendencias/getPendencias");
const verificarJWT = require("../middleware/verificarJWT");

router.get("/pendencias/get/dashboard", getPendencias.getPendenciasOPEN);
router.get(
  "/pendencias/get/openTIO",
  verificarJWT,
  getPendencias.getPendenciasTIOOpen
);
router.get(
  "/pendencias/get/completeTIO",
  verificarJWT,
  getPendencias.getPendenciasTIOComplete
);
router.get(
  "/pendencias/get/openSYGO",
  verificarJWT,
  getPendencias.getPendenciasSYGOOpen
);
router.get(
  "/pendencias/get/completeSYGO",
  verificarJWT,
  getPendencias.getPendenciasSYGOComplete
);
router.get("/pendencias/get/manut", verificarJWT, getPendencias.getManutencao);

module.exports = router;
