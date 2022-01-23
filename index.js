const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const socketio = require("./socket");
const {appPort} = require("./config/app");
const auth = require("./routes/auth");
const index = require("./routes/index");
const chat = require("./routes/chat");
//const bodyParser = require("body-parser");
//const multer = require("multer");
/**app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use( bodyParser.json()); 
 */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//app.use(multer().any()); // este middleware me permite subir archivos al servidor

app.use('/',auth());
app.use('/',index());
app.use('/',chat());
app.use(express.static(__dirname +'/public')); //publicar la carpeta
app.use(express.static(__dirname +'/uploads/user')); //publicar la carpeta
app.use(express.static(__dirname +'/uploads/chat')); //publicar la carpeta

const PORT = appPort || 4000;
const server = http.createServer(app);

//agregar servidor de sockets
socketio(server);

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