const fs = require("fs");
const https = require("https");

const options = {
  // key: fs.readFileSync(""),
  // cert: fs.readFileSync(""),
};

const httpsServer = https.createServer(options);

module.exports = httpsServer;
