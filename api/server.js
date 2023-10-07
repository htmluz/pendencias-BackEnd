const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://10.10.10.150:27017/pendencias", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to DB"))
    .catch(console.error);

const Pendencias = require("./models/pendencias");

app.get("/pendencias", async (req, res) => {   //se fizer uma request pro localhost 3001/pendencias ele já vai retornar a lista toda
    const pendens = await Pendencias.find();   //aqui eu jogo na variável um find que eu rodo pelo mongoose, que criei no pendencias.js

    res.json(pendens);
})

app.post("/pendencias/new", (req, res) => {
    const pendencia = new Pendencias({
        id: req.body.id,
        titulo: req.body.titulo,
        tipo: req.body.titulo,
        responsavel: req.body.responsavel,
        dateinit: req.body.dateinit,
        dateend: req.body.dateend,
        dateatt: req.body.dateatt,
    });

    pendencia.save();

    res.json(pendencia);
})

app.delete("/pendencias/delete/:id", async (req, res) => {
    const result = await Pendencias.findOneAndDelete({id: req.params.id});

    res.json(result);
})

app.put("/pendencias/complete/:id", async (req, res) => {
    const pendencia = await Pendencias.findOne({id: req.params.id});
                                              //implementando assim pra poder reabrir pendencias
    pendencia.complete = !pendencia.complete; //quem tá completo não tá mais basicamente

    pendencia.save();

    res.json(pendencia)
})


app.listen(3001, () => console.log("Server started on port 3001"));