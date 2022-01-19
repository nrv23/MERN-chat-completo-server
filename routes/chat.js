const { Router } = require("express");
const { 
    getChats,createChat,getMessagesPaginated,deleteChat 
    } = require("../controller/ChatController");
const { validarJWT } = require("../middleware/validateToken");
const router = Router();


module.exports = () => {

    router.get('/chats',validarJWT,getChats);
    router.post('/chat/new',validarJWT,createChat);
    router.get('/messages',validarJWT,getMessagesPaginated);
    router.delete('/chat/:id',validarJWT,deleteChat);

    return router;
}