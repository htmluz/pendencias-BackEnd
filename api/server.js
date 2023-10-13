const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();

app.listen(3001, () => console.log("Server started on port 3001"));
app.use(cors());
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

//usuarios e autenticacao

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
    if (!authHeader) return res.sendStatus(401);
    console.log(authHeader);
    const token = authHeader.split(' ')[1]  //isso aqui pq ele volta em duas palavras o token, splito com o espaco e pego o segundo dentro do array
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403);
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



//pendencias

const getPendencias = async (req, res) => {   //busca pendencias
    const pendens = await Pendencias.find();   
    res.json(pendens);
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
    date = date.replace(/-/g , '/')
    return date;
}

// vou fazer inicialmente assim, modelo mvc rest api parece uma boa ideia
//rotas

app.post("/usuarios/new", novoUsuario);
app.post("/usuarios/auth", handleLogin);
app.get("/usuarios/refresh", handleRefreshToken)
app.get("/usuarios/logout", handleLogout);
app.use(verificarJWT);
app.get("/getpendencias", getPendencias);
app.post("/pendencias/new", novaPendencia);
app.put("/pendencias/complete/:id", completaPendencia);
app.delete("/pendencias/delete/:id", async (req, res) => {
    const result = await Pendencias.findOneAndDelete({id: req.params.id});

    res.json(result);
});