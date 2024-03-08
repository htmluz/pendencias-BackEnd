const Pendencias = require("../../models/pendencias");

const editPendencia = async (req, res) => {
  const pendencia = await Pendencias.findOneAndUpdate(
    { id: req.params.id },
    {
      $set: {
        titulo: req.body.titulo,
        tipo: req.body.tipo,
        responsavel: req.body.responsavel,
        dateinit: req.body.dateinit,
        dateend: req.body.dateend,
        dateatt: req.body.dateatt,
        desc: req.body.desc,
        taskid: req.body.taskid,
        incidenturl: req.body.incidenturl,
        massiva: req.body.massiva,
        unidade: req.body.unidade,
      },
    }
  );
  pendencia.save();
  res.json(pendencia);
};

module.exports = editPendencia;
