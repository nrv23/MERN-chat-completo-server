const socketio = require("socket.io");
const getChatters = require("../helpers/Query");
const users = new Map();

const SocketServer = server => {

    const io = socketio(server,{});

    io.on('connection',socket => {

        socket.on('join', async user => {

            let sockets = [];

            console.log("New user joined ",user.firstName)

            if(users.has(user.id)){ 

                const exstingUser = users.get(user.id);
                exstingUser.sockets = [...exstingUser.sockets,...[socket.id]];
                users.set(user.id,exstingUser);
                sockets = [...exstingUser.sockets,...[socket.id]];
            } else {
                users.set(user.id, { id: user.id, sockets: [socket.id] })
                sockets.push(socket.id);
            }

            const onlineFriends = [] //array de ids
            const chatters = await getChatters(user.id); // todos los usuarios
            console.log(chatters);
            //notificar a ls amigos que el usuario esta online
            for (let index = 0; index < chatters.length; index++) {
               if(users.has(chatters[index])) { // si viene un chat en la posicion del indice
                const chatter = users.has(chatters[index]);
                chatters.sockets.forEach(socket => {
                    try {
                        //emitir el estado online del usuario

                        io.to(socket).emit('online',user)
                    } catch (error) {
                        
                    }
                })

                onlineFriends.push(chatter.id);
               
                }
            }


            //notificar a usuarios de los sockets cual de esos amigos esta online
            sockets.forEach(socket => {
                try {
                    //emitir el estado online del usuario

                    io.to(socket).emit('friends',onlineFriends)
                } catch (error) {
                    
                }
            })
           // socket.to(socket.id).emit('typing','User is typing someting...'); // emitir un evento para un socket en espeficico
        })

        socket.on('disconnect', () => {

            console.log("User disconnected ");
        })
    })

   
}


module.exports = SocketServer;