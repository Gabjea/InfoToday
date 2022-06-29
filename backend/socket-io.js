const functions = require('./api/functions')
const Message = require('./models/message')
const mongoose = require('./database/index');
const axios = require("axios");
const Session = require('./models/session');
const User = require('./models/user');

const socket_io = (server) => {

    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    let sockets = []

  

    io.on('connection', (socket) => {
        let isName = false;
        socket.emit('connect-user', 're')


        socket.on('connect-user', async (token) => {
            await functions.getUserByIdFromToken(token).then((user) => {
                socket.user = user
                isName = true
    
            }).catch((err) => {
                console.log(err);
            })
            sockets.push({ socket_id: socket.id, user_id: socket.user._id.toString(), name: socket.user.name + ' ' + socket.user.surname })


            socket.emit('connected', true)
        })


        socket.on("disconnect", (reason) => {

            
            const delSocketIndex = sockets.findIndex((discSocket) => discSocket.socket_id === socket.id)


            sockets.splice(delSocketIndex, 1)

        });

        socket.on('edit-code', data => {
            socket.broadcast.to(socket.room).emit('edit-code', data)
        })

        socket.on('edit-input', data => {
            socket.broadcast.to(socket.room).emit('edit-input', data)
        })


        socket.on('display-problem', data =>{
            socket.broadcast.to(socket.room).emit('display-problem', data)
        })

        socket.on('back', data =>{
            io.to(socket.room).emit('back')
        })

        


        socket.on('end-session', async data =>{ 


            await Session.findByIdAndUpdate(data, {status: 'ended'}, (err, result) =>{
                if (err) console.log(err);
                
              
            }).clone()


            io.to(socket.room).emit('end-session')



        })


        socket.on('send-message', async data => {
            {
                
                io.to(socket.room).emit('send-message', { sender: socket.user._id, receiver: data.otherId, message: data.message })

              
                const newMessage = new Message({
                    _id: new mongoose.Types.ObjectId(),
                    sender: socket.user._id,
                    receiver: data.otherId,
                    message: data.message
                });
                const savedMessage = await newMessage.save().catch((err) => {
                    console.log("Error: ", err);

                });



            }
        })


        socket.on('compile', payload => {

            var config = {
                method: 'post',
                url: `${process.env.HOST}/api/v1/user/problem/evaluate/${payload.problem}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': payload.jwt
                },
                data: {
                    editorCode: payload.editorCode,
                    input: payload.input
                }
            };

            axios(config)
                .then(function (response) {
                    io.sockets.in(socket.room).emit('compile', response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
        })


        socket.on('selection-code', data => {
            socket.broadcast.to(socket.room).emit('selection-code', data)
        })

        socket.on('selection-input', data => {
            socket.broadcast.to(socket.room).emit('selection-input', data)
        })


        socket.on('move-cursor', async data => {
            if (isName) {
                socket.broadcast.to(socket.room).emit('move-cursor', {
                    pos: data,
                    name: socket.user.name + " " + socket.user.surname
                })
            }
        })

        socket.on('join-room', async (room) => {
            socket.join(room)
            socket.room = room

        })



    })




}

module.exports = socket_io