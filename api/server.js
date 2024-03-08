const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const https = require("https");
const fs = require("fs");
const verificarJWT = require("./middleware/verificarJWT");
const credentials = require("./middleware/verifyCredentials");

//temp até terminar as rotas
const novoUsuario = require("./controller/User/newUser");
const handleLogin = require("./controller/User/handleLogin");
const handleRefreshToken = require("./controller/User/refreshToken");
const handleLogout = require("./controller/User/handleLogout");
const getUsuarios = require("./controller/User/getUsers");
const deleteUsuario = require("./controller/User/deleteUser");
const editUsuario = require("./controller/User/editUser");

const newTipo = require("./controller/Tipos/newTipo");
const getTipos = require("./controller/Tipos/getTipos");
const deleteTipo = require("./controller/Tipos/deleteTipo");
const editTipo = require("./controller/Tipos/editTipo");

const getPendencias = require("./controller/Pendencias/getPendencias");
const novaPendencia = require("./controller/Pendencias/newPendencia");
const completaPendencia = require("./controller/Pendencias/completePendencia");
const editPendencia = require("./controller/Pendencias/editPendencia");
const newAndamento = require("./controller/Pendencias/newAndamento");

const app = express();

// const options = {
//     key: fs.readFileSync('/var/www/pendencias/certs/private/server.key'),
//     cert: fs.readFileSync('/var/www/pendencias/certs/server.crt')
// };

// const httpsServer = https.createServer(options, app);
// httpsServer.listen(3001, () => {
//     console.log('Https server started on port 3001');
// });

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.listen(3001, () => console.log("Server started on port 3001"));

mongoose
  .connect("mongodb://10.10.10.150:27017/pendencias", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch(console.log("Não foi possível conectar ao db"));

//rotas

app.post("/usuarios/new", novoUsuario);
app.post("/usuarios/auth", handleLogin);
app.get("/usuarios/refresh", handleRefreshToken);
app.get("/usuarios/logout", handleLogout);
app.get("/usuarios/get", getUsuarios);
app.get("/pendencias/get/dashboard", getPendencias.getPendenciasOPEN);
app.use(verificarJWT);
app.get("/pendencias/get/openTIO", getPendencias.getPendenciasTIOOpen);
app.get("/pendencias/get/completeTIO", getPendencias.getPendenciasTIOComplete);
app.get("/pendencias/get/openSYGO", getPendencias.getPendenciasSYGOOpen);
app.get(
  "/pendencias/get/completeSYGO",
  getPendencias.getPendenciasSYGOComplete
);
app.get("/pendencias/get/manut", getPendencias.getManutencao);
app.post("/pendencias/new", novaPendencia);
app.put("/pendencias/complete/:id", completaPendencia);
app.put("/pendencias/edit/:id", editPendencia);
app.put("/pendencias/andamento/:id", newAndamento);
app.post("/tipos/new", newTipo);
app.get("/tipos/get", getTipos);
app.delete("/tipos/delete/:tipo", deleteTipo);
app.put("/tipos/edit/:tipo", editTipo);
app.put("/usuarios/edit/:name", editUsuario);
app.delete("/usuarios/delete/:name", deleteUsuario);
