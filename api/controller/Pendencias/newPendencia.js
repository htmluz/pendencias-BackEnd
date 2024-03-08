const Pendencias = require("../../models/pendencias");
const getNextId = require("../../middleware/getNextId");

const novaPendencia = async (req, res) => {
  const nextId = await getNextId();
  const pendencia = new Pendencias({
    id: nextId,
    titulo: req.body.titulo,
    desc: req.body.desc,
    tipo: req.body.tipo,
    responsavel: req.body.responsavel,
    dateinit: req.body.dateinit,
    dateend: req.body.dateend,
    dateatt: req.body.dateatt,
    taskid: req.body.taskid,
    incidenturl: req.body.incidenturl,
    abertura: req.body.abertura,
    fechamento: {
      user: "",
    },
    unidade: req.body.unidade,
    massiva: req.body.massiva,
  });
  const savependencia = await pendencia.save();
  res.json(pendencia);
};

module.exports = novaPendencia;
