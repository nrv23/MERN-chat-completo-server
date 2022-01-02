const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const {appPort} = require("./config/app");
const auth = require("./routes/auth");
const index = require("./routes/index");

app.use(cors());
app.use(express.json());
app.use('/',auth());
app.use('/',index());
app.use(express.static(__dirname +'/public')); //publicar la carpeta
const PORT = appPort || 4000;
const server = http.createServer(app);

//agregar servidor de sockets
socketio(server,{});

// servidor http corriendo
server.listen(PORT,() => {
    console.log(`Servidor escuchando en puerto ${appPort}`)
})


/*
usuario postgres: nvm23
contraseña postgres: nvm23
base de datos : chat_app
Aprender postgresql
*/