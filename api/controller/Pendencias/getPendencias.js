const Pendencias = require("../../models/pendencias");

const getPendenciasOPEN = async (req, res) => {
  //busca pendencias
  const pendens = await Pendencias.find({ complete: false });
  res.json(pendens);
};

const getPendenciasTIOOpen = async (req, res) => {
  const pendens = await Pendencias.find({ complete: false, unidade: "TIO" });
  res.json(pendens);
};

const getPendenciasTIOComplete = async (req, res) => {
  const pendens = await Pendencias.find({ complete: true, unidade: "TIO" });
  res.json(pendens);
};

const getPendenciasSYGOOpen = async (req, res) => {
  const pendens = await Pendencias.find({ complete: false, unidade: "SYGO" });
  res.json(pendens);
};

const getPendenciasSYGOComplete = async (req, res) => {
  const pendens = await Pendencias.find({ complete: true, unidade: "SYGO" });
  res.json(pendens);
};

const getManutencao = async (req, res) => {
  const manut = await Pendencias.find({
    complete: false,
    tipo: "Campanha de Manutenção",
  });
  res.json(manut);
};

module.exports = {
  getManutencao,
  getPendenciasOPEN,
  getPendenciasTIOOpen,
  getPendenciasSYGOOpen,
  getPendenciasTIOComplete,
  getPendenciasSYGOComplete,
};
