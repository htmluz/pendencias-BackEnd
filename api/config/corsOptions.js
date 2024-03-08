const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: allowedOrigins,
};

module.exports = corsOptions;
