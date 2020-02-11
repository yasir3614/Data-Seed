const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

const Chat = require('./models/chat');

app.get('/', function(req, res) {
    console.log('err')
  Chat.find({},function(err,messages) {
    if(err)console.log(err);
    
    res.render('chat', {messages:messages});
  });
});

io.on('connection', socket => {
  socket.on('chat', data => {
    Chat.create({name: data.handle, message: data.message}).then(() => {
      io.sockets.emit('chat', data); // return data
    }).catch(err => console.error(err));
  });
  socket.on('typing', data => {
    socket.broadcast.emit('typing', data); // return data
  });
});

// listen
app.listen(process.env.PORT ,process.env.IP, () => {
  console.log('Running');
});