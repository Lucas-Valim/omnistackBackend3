const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const url = 'mongodb+srv://omnistack:omnistack@cluster0-qkf5f.mongodb.net/omnistack8?retryWrites=true&w=majority';
const options = { reconnectTries: Number.MAX_VALUE, reconnectInterval: 500, poolSize: 5, useNewUrlParser: true, useUnifiedTopology: true };

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


const connectedUsers = {}

io.on('connection', socket => {
   const { user } = socket.handshake.query;


   connectedUsers[user] = socket.id;
});

mongoose.connect(url, options);

mongoose.connection.on('connected', () => {
   console.log('Aplicação conectada com banco de dados');
})

app.use((req, res, next) => {
   req.io = io;
   req.connectedUsers = connectedUsers;

   return next();
});


app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(8080);

