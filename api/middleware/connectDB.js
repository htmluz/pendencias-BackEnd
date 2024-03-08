const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://10.10.10.150:27017/pendencias", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado ao DB");
  } catch (err) {
    console.error("Não foi possível conectar ao DB");
  }
}

module.exports = connectDB;
