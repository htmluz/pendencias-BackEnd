const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');

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
const Usuarios = require("./models/usuarios");


const novoUsuario = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message': 'Usuário e senha são necessários.'});
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = new Usuarios({
            user: req.body.user,
            pwd: hashedPwd
        })
        const saveuser = await newUser.save()
        res.status(201).json({ 'success:': `Novo usuario ${user} criado`})
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
} 

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message': 'Usuário e senha são necessários.'});
    const foundUser = await Usuarios.findOne({ user: user});
    if (!foundUser) return res.sendStatus(401);
    const match = await bcrypt.compare(pwd, foundUser.pwd)
    if (match) {
        res.json({ 'success': `${user} Logado`})
    } else {
        res.sendStatus(401);
    }
}

const novaPendencia = async (req, res) => {
    const count = await Pendencias.countDocuments();

    const pendencia = new Pendencias({
        id: count + 1,  //por enquanto vai ficar assim, mais pra frente implementar uma collection counter e atualizar atomicamente
        titulo: req.body.titulo,
        desc: req.body.desc,
        tipo: req.body.tipo,
        responsavel: req.body.responsavel,
        dateinit: formataData(req.body.dateinit),
        dateend: formataData(req.body.dateend),
        dateatt: formataData(req.body.dateatt), 
        abertura: req.body.abertura,
        fechamento: {
            user: ""
        }
    });

    const savependencia = await pendencia.save();

    res.json(pendencia);
}

const completaPendencia = async (req, res) => {     //vai ser enviado um form, alterar fechamento.user e fechamento.dateclosening
    const pendencia = await Pendencias.findOne({id: req.params.id});                                    
    pendencia.complete = !pendencia.complete; 
    pendencia.save();
    res.json(pendencia)
}

function formataData(date) {
    date = date.replace(/T/g, ' ');
    return date;
}

// vou fazer inicialmente assim, modelo mvc rest api parece uma boa ideia

app.post("/usuarios/new", novoUsuario)
app.post("/usuarios/auth", handleLogin)

app.get("/getpendencias", async (req, res) => {   //busca pendencias
    const pendens = await Pendencias.find();   
    res.json(pendens);
})

app.post("/pendencias/new", novaPendencia)

app.put("/pendencias/complete/:id", completaPendencia)

app.delete("/pendencias/delete/:id", async (req, res) => {
    const result = await Pendencias.findOneAndDelete({id: req.params.id});

    res.json(result);
})