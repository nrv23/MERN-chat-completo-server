const { Op } = require("sequelize");
const { 
    Chat,
    User,
    ChatUser,
    Message,
    sequelize
} = require("../models");

const getChats = async (req,res) => {
    console.log(req.user);
    try {

        const {
            user: {
                id
            }
        } = req;

        const user = await User.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Chat,
                    include: [
                        {
                            model: User,
                            where: {
                                [Op.not]: {
                                    id
                                }
                            }
                        },
                        {
                            model: Message,
                            include: [
                                {
                                    model: User
                                }
                            ],
                            limit: 20,
                            order: [['id', 'DESC']]
                        }
                    ]
                }
            ]
        })

        return res.status(200).json(user.Chats);
        
    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            msg: 'Hubo un error al cargar los mensajes'
        })
    }
}

const createChat = async (req,res) => {
    
    const t = await sequelize.transaction()

    try {

        const {
            user: {
                id
            },
            body: {
                partnerId
            }
        } = req;

        const user = await User.findOne({
            where:{
                id
            },
            include: [
                {
                    model: Chat,
                    where: {
                        type: 'dual'
                    },
                    include: [
                        {
                            model: ChatUser,
                            where: {
                                userId: partnerId
                            }
                        }
                    ]
                }
            ]
        });

        if(user && user.Chats.length > 0) return res.status(403).json({
            msg: 'Chat con este usuario ya existe'
        })
        
        const chat = await Chat.create({type:'dual'},{transaction: t});

        await ChatUser.bulkCreate([
            {
                chatId: chat.id,
                userId: id,
            },
            {
                chatId: chat.id,
                userId: partnerId,
            }
        ],{transaction: t});
        
        await t.commit();  //guardar la transaccion

        const chatPayload = await Chat.findOne({
            where:{
                id: chat.id
            },
            include: [
                {
                    model: Chat,
                    include: [
                        {
                            model:User, 
                            where: {
                                [Op.not]: {
                                    id
                                }
                            }
                        },
                        {
                            model: Message
                        }
                    ]          
                }
            ]
        });

        return res.status(201).json({
            chat: chatPayload
        })

    } catch (error) {
        console.log(error);
        await t.rollback(); // devolver al estado anterior

        res.status(500).json({
            msg: 'Error al crear el chat'
        })
    }
}

const getMessagesPaginated = async (req,res) => {

    try {

        const limit =10;
        const page = req.query.page || 1;
        const offset =  page > 1 ? page * limit : 0;

        const messages = await Message.findAndCountAll({
            where: {
                chatId: req.query.id
            },
            limit,
            offset
        });

        const totalPages = Math.ceil(messages.count / limit);

        if(page > totalPages) {
            return res.status(200).json({ data: { messages: []  } });
        } else {

            const result = {

                messages: messages.rows,
                pagination: {
                    page,
                    totalPages
                }
            }

            return res.json(result)

        }
        
    } catch (error) {

        console.log(error);

        return res.status(500).json({
            msg: 'Error al obtener los mensajes'
        })
    }
}

const deleteChat = async (req,res) => {

    try {

        const {
            params: {
                id
            }
        } = req;

        await Chat.destroy({
            where:{
                id 
            }
        });

        return res.status(204).json();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al eliminar el chat'
        })
    }
}

module.exports = {

    getChats,
    createChat,
    getMessagesPaginated,
    deleteChat

}