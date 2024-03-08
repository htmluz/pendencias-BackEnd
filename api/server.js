const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const httpsServer = require("./config/httpsConfig");
const connectDB = require("./middleware/connectDB");
const credentials = require("./middleware/verifyCredentials");
const usersRoutes = require("./routes/users");
const tiposRoutes = require("./routes/tipos");
const pendenciasGet = require("./routes/pendenciasGet");
const pendenciasEdit = require("./routes/pendenciasEdit");

const app = express();
connectDB();
// httpsServer.listen(3001, () => {
//   console.log("Servidor HTTPS iniciado na porta 3001")
// })
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.listen(3001, () => console.log("Servidor HTTP iniciado na porta 3001"));
app.use(pendenciasGet);
app.use(pendenciasEdit);
app.use(usersRoutes);
app.use(tiposRoutes);
