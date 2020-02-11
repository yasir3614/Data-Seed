var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var multer = require('multer');
var upload = multer({dest: './uploads'});
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;
var client = require("socket.io").listen(4000).sockets;

var app=express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./libs/db-connection');

app.use('/public', express.static('public'));


const Chat = require('./models/Chat');


var finance = require('./routes/finance');
var routes = require('./routes/index');
var users = require('./routes/users');
var buyer=require('./routes/buyer');
var seller=require('./routes/seller');
var general=require('./routes/general');
var fileupload=require("./routes/fileupload");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));







app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use(function (req, res, next) {
  // res.locals.messages = require('express-messages')(req, res);
  next();
});




app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  res.locals.messages = req.flash('success');

  next();
});





app.use('/', routes);
app.use('/users', users);
app.use('/buyer',buyer);
app.use('/seller',seller);
app.use('/general',general);
app.use('/upload',fileupload);
app.use('/finance',finance);

//--------------------------------------Chat------------------------------------
var users={};//nickname to be key...and value to be socket..
//now create a route which is what made easy  by express
app.get('/message',ensureAuthenticated,function(req,res){
// 	res.render(__dirname+"/indexC.ejs")
res.render("indexC.ejs")
});
app.get('/message/:name',ensureAuthenticated,function(req, res) {
   res.render('indexC.ejs',{to:req.params.name}); 
});

//put up socket functionality on server side
io.sockets.on('connection',function(socket){//everytime a user connects has its own socket
	//console.log("new user");
	socket.on('new user',function(data,callback){
		console.log("New user");
		//socket.emit('select_room',data);
		
			console.log("here");
			callback(true);
			socket.nickname=data;//store nickname of each user becomes clear on disconnect
			users[socket.nickname]=socket;//key value pair as defined above
			//nicknames.push(socket.nickname);
			//io.sockets.emit('usernames',nicknames);//send usernames for display
			updateNicknames();
		
	});
	socket.on('sendmessage',function(data,callback){
		//console.log(data);
		var msg=data.trim();
		if(msg[0]=='@')//if thats whisper or private msg
		{
			msg=msg.substr(1);//start of name onwards
			var idx=msg.indexOf(' ');
			if(idx!==-1)
			{
				//check the username is valid
				var name=msg.substr(0,idx);
				msg=msg.substr(idx+1);
				if(name in users)
				{
					users[name].emit('whisper',{msg:msg,nick:socket.nickname});
					console.log('whispered');	
				}
				else
				{
					callback('Error! User not connected to chat pool!');
				}	
			}
			else//no actual msg part
			{
				callback('Error! Please enter a message for your whisper');
			}
		}
		else{
			io.sockets.emit('newmessage',{msg:msg,nick:socket.nickname});//broadcast to everyone and i too can see the msg
			//socket.broadcast.emit('newmessage',data);//broadcast to evry1 except me
		}

	});
	function updateNicknames(){
		io.sockets.emit('usernames',Object.keys(users));//sending socket does not make sense
	}
	//whenever user disconnect he/she should be removed from the list
	socket.on('disconnect',function(data){
		if(!socket.nickname)//when the user has no nickname 
			return;
		delete users[socket.nickname];
		updateNicknames();
	});
});


//////////////////////////////

app.get('*', function(req, res) {
 res.render('notfound.ejs');
    // return res.redirect('/');
});

// listen
http.listen(process.env.PORT || 3000, () => {
  console.log('Running');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}




// app.listen(process.env.PORT,process.env.IP,function(req,res){
//   console.log("ss");
// });
module.exports = app;
