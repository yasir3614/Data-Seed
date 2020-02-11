const express = require('express');
var router=express.Router();

const http = require('http').Server(router);
const io = require('socket.io')(http);

require('../libs/db-connection');


const Chat = require('../models/Chat');

router.get('/', (req, res) => {
  console.log('here in chat');
  Chat.find({}).then(messages => {
    res.render('indexC', {messages});
  }).catch(err => console.error(err));
});

io.on('connection', socket => {
  console.log('socket is connected');
  socket.on('chat', data => {
    console.log('socket chat');
    Chat.create({name: data.handle, message: data.message}).then(() => {
      io.sockets.emit('chat', data); // return data
    }).catch(err => console.error(err));
  });
  socket.on('typing', data => {
    socket.broadcast.emit('typing', data); // return data
  });
});

// // listen
// http.listen(process.env.PORT || 3000, () => {
//   console.log('Running');
// });
module.exports=router;