// const express = require('express');
// const app = express();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);

// require('./libs/db-connection');

// app.use('/public', express.static('public'));
// app.set('view engine', 'ejs');

// const Chat = require('./models/Chat');

// app.get('/', (req, res) => {
//   Chat.find({}).then(messages => {
//     res.render('indexC', {messages});
//   }).catch(err => console.error(err));
// });

// io.on('connection', socket => {
//   socket.on('chat', data => {
//     Chat.create({name: data.handle, message: data.message}).then(() => {
//       io.sockets.emit('chat', data); // return data
//     }).catch(err => console.error(err));
//   });
//   socket.on('typing', data => {
//     socket.broadcast.emit('typing', data); // return data
//   });
// });

// // listen
// http.listen(process.env.PORT || 3000, () => {
//   console.log('Running');
// });



var http = require('http'),
	app = require('express'),
	server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(process.env.port);



app.get('/', function(req, res){
	res.sendfile(__dirname + '/views/indexC.ejs');
});