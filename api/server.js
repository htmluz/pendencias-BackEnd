const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.listen(3001, () => console.log("Server started on port 3001"));

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://10.10.10.150:27017/pendencias", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to DB"))
    .catch(console.error);

const Pendencias = require("./models/pendencias");

app.get("/getpendencias", async (req, res) => {   //busca pendencias
    const pendens = await Pendencias.find();   
    res.json(pendens);
})

app.post("/pendencias/new", async (req, res) => { //nova pendencia, form de nova pendencias
    const count = await Pendencias.countDocuments();

    const pendencia = new Pendencias({
        id: count + 1,  //por enquanto vai ficar assim, mais pra frente implementar uma coleção counter e atualizar atomicamente
        titulo: req.body.titulo,
        desc: req.body.desc,
        tipo: req.body.tipo,
        responsavel: req.body.responsavel,
        dateinit: req.body.dateinit,
        dateend: req.body.dateend,
        dateatt: req.body.dateatt, 
        abertura: {
            user: ""
        },
        fechamento: {
            user: ""
        }
    });

    const savependencia = await pendencia.save();

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


