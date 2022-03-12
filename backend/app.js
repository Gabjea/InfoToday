require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const axios = require("axios")
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload")
const controller = require("./api/controllers/user");


const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const middlewares = require("./middlewares");
const api = require('./api')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

const functions = require('./api/functions')
const Message = require('./models/message')
const mongoose = require('./database/index')

let sockets = []

io.on('connection', (socket) => {
  
  socket.on("disconnect", (reason) => {
    const delSocketIndex =sockets.findIndex((discSocket) => discSocket.socket_id === socket.id)
    sockets.splice(delSocketIndex,1)
    console.log(sockets);
  });

  let isName = false;

  socket.emit('getname')
  socket.on('getname', async (token) => {
    socket.user = await functions.getUserByIdFromToken(token)
    isName = true
    sockets.push({socket_id: socket.id, user_id: socket.user._id.toString()})
    console.log(sockets);
  })

  socket.on('edit-code', data => {
    socket.broadcast.emit('edit-code', data)
  })

  socket.on('edit-input', data => {
    socket.broadcast.emit('edit-input', data)
  })

  socket.on('send-message',async data => {{
    const sendToIndex =sockets.findIndex((sendTo) => sendTo.user_id === data.otherId)
    const senderIndex = sockets.findIndex((sender) => sender.socket_id === socket.id)
    
    socket.to(sockets[sendToIndex].socket_id).emit('send-message',
    {sender: sockets[senderIndex].user_id,
     receiver: sockets[sendToIndex].user_id,
     message : data.message
    })

    io.to(sockets[senderIndex].socket_id).emit('send-message',
    {sender: sockets[senderIndex].user_id,
     receiver: sockets[sendToIndex].user_id,
     message : data.message
    })

    const newMessage = new Message({
      _id: new mongoose.Types.ObjectId(),
      sender: sockets[senderIndex].user_id,
      receiver: sockets[sendToIndex].user_id,
      message: data.message
    });
    const savedMessage = await newMessage.save().catch((err) => {
        console.log("Error: ", err);
        
    });

    if(savedMessage)
      console.log("merge")

  }})



  socket.on('compile', data => {
    console.log(data.editorCode);
    var post = JSON.stringify({
      "code": data.editorCode,
      "language": "cpp",
      "input": data.input !== null ? data.input : '' 
    });

    var config = {
      method: 'post',
      url: 'https://codexweb.netlify.app/.netlify/functions/enforceCode',
      headers: {
        'Content-Type': 'application/json'
      },
      data: post
    };

    axios(config)
      .then(function (response) {
        io.emit('compile', response.data.output)
      })
      .catch(function (error) {
        console.log(error);
      });
  })


  socket.on('selection', data => {


    socket.broadcast.emit('selection', data)
  })

  socket.on('selection-input', data => {


    socket.broadcast.emit('selection-input', data)
  })


  socket.on('move-cursor', async data => {
    if (isName) {

      socket.broadcast.emit('move-cursor', {
        pos: data,
        name: socket.user.name + " " + socket.user.surname
      })
    }
  })
})


app.get("/", (req, res) => {
  res.json({
    message: "👋🌎 Team",
  });
});

app.use(fileUpload({
  createParentPath: true
}));

app.use("/api/v1", api);

app.get("/uploads/icons/:img", controller.getUploadedIcon)


app.use(bodyParser.urlencoded({ extended: true }));
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


module.exports = server;