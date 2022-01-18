const { 
    Chat,
    User,
    ChatUser,
    Message
} = require("../models");



const getMessagesToPaginate = async (req,res) => {

    try {

        const {
            user: {
                id
            }
        } = req;

        
    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            msg: 'Hubo un error al cargar los mensajes'
        })
    }
}

module.exports = {

    getMessagesToPaginate

}