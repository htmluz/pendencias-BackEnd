const allowedOrigins = require("./alllowedOrigins");

const corsOptions = {
    origin: allowedOrigins
    }


module.exports = corsOptions;