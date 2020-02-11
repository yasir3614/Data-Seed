
var express = require('express');
var router = express.Router();
var account=require("../models/account");
var randomstring = require("randomstring");
var data=require('../models/data');
var acessToken=require("../models/acessTokens");
var user=require("../models/user");
var finance=require("../models/reciept");
var income=require("../models/income");
"use strict";



router.get('/',isloggedin,function(req,res){
    
    
    finance.find({},function(err,allReciepts){
    	if(err) console.log(err);
    	
    	 res.render("finance.ejs",{allReciepts:allReciepts});
    	
    	});
    
   
    
});

router.get('/funds',function(req,res){
	res.send("funds");
	});
			

function isloggedin(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	
	res.redirect('/users/login');
}





module.exports = router;
