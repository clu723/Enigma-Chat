var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);
var path = require('path');
const { Machine } = require('./public/enigma');


app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// user's name
var name;

io.on('connection', (socket) => {
  // stores user's name on connection
  socket.on('join', (username) => {
    name = username;
    console.log(`User '${username}' has connected!`);
    socket.broadcast.emit('message', `${username} just joined the chat!`);
  });

  // when user sends message
  socket.on('chatMessage', (username, msg) => {
    socket.broadcast.emit('message', `${username}: ` + msg);
  });

  // when user disconnects
  socket.on('disconnect', () => {
    console.log(`User '${name}' has disconnected!`);
    socket.broadcast.emit('message', `${name} left the chat!`);
  });

});

// puts server port on 3000
server.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on :3000');
});


