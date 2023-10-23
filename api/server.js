const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const allowedOrigins = require('./config/alllowedOrigins');
const corsOptions = require("./config/corsOptions");
const moment = require("moment-timezone")

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        // res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

const app = express();

app.listen(3001, () => console.log("Server started on port 3001"));
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


mongoose.connect("mongodb://10.10.10.150:27017/pendencias", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to DB"))
    .catch(console.error);

const Pendencias = require("./models/pendencias");
const Usuarios = require("./models/usuarios");
const Tipos = require("./models/tipos")
const Counter = require("./models/counter")



//usuarios

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

const getUsuarios = async (req, res) => {   
    const users = await Usuarios.find();   
    res.json(users);
}



//autenticacao

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message': 'Usuário e senha são necessários.'});
    const foundUser = await Usuarios.findOne({ user: user});
    if (!foundUser) return res.sendStatus(401);
    const match = await bcrypt.compare(pwd, foundUser.pwd)
    if (match) {
        const accessToken = jwt.sign(
            { "user": foundUser.user},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' }
        );
        const refreshToken = jwt.sign(
            { "user": foundUser.user},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        const insertRefreshToken = await Usuarios.findOneAndUpdate(
            {user: user}, 
            {refreshtoken: refreshToken}
        );
        insertRefreshToken.save();
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
        res.json({accessToken});
    } else {
        res.sendStatus(401);
    }
}

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt
    const foundUser = await Usuarios.findOne({ refreshtoken: refreshToken});
    if (!foundUser) return res.sendStatus(403);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.user !== decoded.user) return res.sendStatus(403)
            const accessToken = jwt.sign(
                { 'user': decoded.user},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m'}
                );
                res.json({ accessToken })
        } 
    )
}

const verificarJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401); //se n existir header auth volta 401
    console.log(authHeader);
    const token = authHeader.split(' ')[1]  //isso aqui pq ele volta em duas palavras o token, splito com o espaco e pego o segundo dentro do array
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
             return res.sendStatus(403)}
            req.user = decoded.user;
            next();
        }
    )
}

const handleLogout = async (req, res) => {
    //tambem deletar o accesstoken no frontend
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt
    const deleteToken = await Usuarios.findOneAndUpdate(
        { refreshtoken: refreshToken },
        { $set: { refreshtoken: '' } }
        );
    deleteToken.save();
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
}


//tipos
const newTipo = async (req, res) => {
    const tipos = new Tipos({
        tipo: req.body.tipo
    });

    const savetipo = await tipos.save();
    res.json(tipos);
}

const getTipos = async (req, res) => {
    const tipos = await Tipos.find();
    res.json(tipos);
}


//pendencias

async function getNextId() {
    const counter = await Counter.findOneAndUpdate( {name: "contador"}, 
        { $inc: { count: 1 } },
        { new: true }
        );
        return counter.count;
}

const getPendencias = async (req, res) => {   //busca pendencias
    const pendens = await Pendencias.find();   
    res.json(pendens);
}

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
            user: ""
        }
    });
    const savependencia = await pendencia.save();
    res.json(pendencia);
}

const completaPendencia = async (req, res) => {     //vai ser enviado um form, alterar fechamento.user e fechamento.dateclosening
    const pendencia = await Pendencias.findOne({id: req.params.id});        
    pendencia.complete = true; 
    pendencia.fechamento.user = req.body.fechamento.user;
    pendencia.fechamento.dateclosening = req.body.fechamento.dateclosening;
    pendencia.save();
    res.json(pendencia)
}


const editPendencia = async (req, res) => {
    const pendencia = await Pendencias.findOneAndUpdate({id: req.params.id},
        { $set: { titulo: req.body.titulo,
        tipo: req.body.tipo,
        responsavel: req.body.responsavel,
        dateinit: req.body.dateinit,
        dateend: req.body.dateend,
        dateatt: req.body.dateatt,
        desc: req.body.desc,
        taskid: req.body.taskid,
        incidenturl: req.body.incidenturl }
        });
    pendencia.save();
    res.json(pendencia);
}

const newAndamento = async (req, res) => {
    const novoAndamento = {
        id: req.body.andamento.id,
                dateandamento: moment().tz("America/Sao_Paulo"),
                user: req.body.andamento.user,
                andamento: req.body.andamento.andamento
    }
    const andamento = await Pendencias.findOneAndUpdate({id: req.params.id},
        { $push: { andamento: novoAndamento } }
        );
    res.json(andamento);
}

//rotas

app.post("/usuarios/new", novoUsuario);
app.post("/usuarios/auth", handleLogin);
app.get("/usuarios/refresh", handleRefreshToken);
app.get("/usuarios/logout", handleLogout);
app.get("/usuarios/get", getUsuarios);
app.use(verificarJWT);
app.get("/getpendencias", getPendencias);
app.post("/pendencias/new", novaPendencia);
app.put("/pendencias/complete/:id", completaPendencia);
app.put("/pendencias/edit/:id", editPendencia);
app.put("/pendencias/andamento/:id", newAndamento);
app.post("/tipos/new", newTipo);
app.get("/tipos/get", getTipos);
app.delete("/pendencias/delete/:id", async (req, res) => {
    const result = await Pendencias.findOneAndDelete({id: req.params.id});

    res.json(result);
});