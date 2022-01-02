require("dotenv").config({path:'.env'});

module.exports = {

    appkey: process.env.APP_KEY,
    appPort: process.env.APP_PORT,
    appUrl: process.env.APP_URL
}


