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




var routes = require('./routes/index');
var users = require('./routes/users');
var buyer=require('./routes/buyer');
var seller=require('./routes/seller');
var general=require('./routes/general');
var fileupload=require("./routes/fileupload");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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

//--------------------------------------Chat------------------------------------
// const express = require('express');
// const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./libs/db-connection');

app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

const Chat = require('./models/Chat');

app.get('/', (req, res) => {
  Chat.find({}).then(messages => {
    res.render('indexC', {messages});
  }).catch(err => console.error(err));
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
http.listen(process.env.PORT || 3000, () => {
  console.log('Running');
});


app.listen(process.env.PORT,process.env.IP,function(req,res){
  console.log("ss");
});
module.exports = app;
