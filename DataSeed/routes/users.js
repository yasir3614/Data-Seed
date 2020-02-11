var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var randomstring = require("randomstring");
var User = require('../models/user');
var data=require('../models/data');
var checklist=require("../models/checklist");

"use strict";
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dataseedltd@gmail.com',
      pass: 'dataseed1'
    }
  });  


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/register/:type', function(req, res, next) {

  res.render('user/register.ejs',{title:'Register',type:req.params.type});
});

router.get('/login', function(req, res, next) {
  res.render('user/login.ejs', {title:'Login'});
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
        var previouspath=req.cookies.previouspath;    
    
        if(req.cookies.checklist==undefined){
           req.flash('success', 'You are now logged in');
             if(req.user.as=='seller'){
                if(previouspath!=undefined){
                if(previouspath.length!=0)
                res.redirect(previouspath);
                else
                res.redirect('/buyer');
                }
                else
                res.redirect('/buyer');            
                }
             else {
                if(previouspath!=undefined){
                      if(previouspath.length!=0)
                      res.redirect(previouspath);
                      else
                      res.redirect('/buyer');
                }
                else
                res.redirect('/buyer');
             }
          }
        else{
         var ids=req.cookies.checklist['data']
              
							var checks=[];
						for(var i=0;i<ids.length;i++){
						    checks.push({user:req.user,data:ids[i]});
						}
				  checklist.insertMany(checks,function(err, d) {
				     if(err)console.log(err); 
				     
				     res.clearCookie('checklist'); 
               req.flash('success', 'You are now logged in');
             if(req.user.as=='seller'){
                 if(previouspath.length!=0)
                res.redirect(previouspath);
                else
                res.redirect('/seller')

             }
             else {
                if(previouspath.length!=0)
                res.redirect(previouspath);
                else
                res.redirect('/buyer')
             }
         }); 
        } 
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message:'Invalid Password'});
      }
    });
  });
}));

router.post('/register/:type',function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var institution=req.body.institution;
	var education=req.body.education;
	var proffession=req.body.proffession;
  var	country=req.body.country;
  //check if email does not already exists
  //check if username does not already exists
  
  User.find({ $or: [ { email: { $eq: req.body.email } }, { username: { $eq: req.body.username } } ] },function(err,data){
    if(err)console.log(err);
    if(data.length!=0){
    
    console.log(data.length);
     req.flash('success','email or username is repeated.');
     res.redirect('/users/register/'+req.params.type);
    
    }
    else
    {
      
        var password = req.body.password;
        var password2 = req.body.password2;
        var as      =req.params.type;
      
        // Form Validator
        req.checkBody('name','Name field is required').notEmpty();
        req.checkBody('email','Email field is required').notEmpty();
        req.checkBody('email','Email is not valid').isEmail();
        req.checkBody('username','Username field is required').notEmpty();
        req.checkBody('password','Password field is required').notEmpty();
      
        // Check Errors
        var errors = req.validationErrors();
      
        if(errors){
        	res.render('user/register.ejs', {
        		errors: errors
        	});
        } else{
        	var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            as          :as,
            institution:institution,
          	 education:education,
          	 proffession:proffession,
           	country:country
          });
      
          User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
          });
      
          // res.location('/');
      var token=randomstring.generate(7);
      var to=req.body.email;
      var subject='Email Confirmation from dataSeed ';
      var message='<h1>Use this code to register </h1><p>Your verification Code is: <h2>'+token+'</h2></p>';
    	var mailOptions=sendmail(to,subject,message);
		transporter.sendMail(mailOptions, function(error, info){
                          if (error) {
                              console.log(error);
                          }
                          else
                          {
                                res.render('user/emailconfirmation.ejs',{username:req.body.username,token:token});
      
                          }
		});
          
          
          
        }
            
      
      
      }
  
  
  });  
  
  function sendmail(to,subject,message){
    
    var mailOptions = {
    from: 'dataseedltd@gmail.com',
    to: to,
    subject: subject,
    html: message 
           
    };
    return mailOptions;
  
}
			
  router.post('/emailconfirmation/:token',function(req, res) {
      if(req.params.token==req.body.token){
              req.flash('success', 'You are now registered and can login');
                res.redirect('/');        
        }
        else{
            User.remove({username:req.body.username},function(err,data){
              if(err)console.log(err);
              res.redirect('/');
              
              });  
        }
  });
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});


module.exports = router;
