const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const bodyParser = require('body-parser');
require("dotenv").config();


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

io.on('connection', (socket) => {
  socket.on("disconnect", (reason) => {
    console.log(reason)
  });

   let isName = false;

  socket.emit('getname')
  socket.on('getname', async(token) => {
    socket.user = await functions.getUserByIdFromToken(token)
    isName = true
  })
  
  socket.on('move-cursor',async data => {
    if(isName)
    {
      
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



app.use("/api/v1", api);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


module.exports = server;