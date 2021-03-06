require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload")
const controller = require("./api/controllers/user");


const app = express();
const server = require('http').createServer(app);
const socket_io = require('./socket-io')(server)
const middlewares = require("./middlewares");
const api = require('./api')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Headers, *, Access-Control-Allow-Origin', 'Origin, X-Requested-with, Content_Type,Accept,Authorization','http://localhost:4200');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

const functions = require('./api/functions')
const Message = require('./models/message')
const mongoose = require('./database/index');


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
