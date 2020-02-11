var express = require('express');
var router = express.Router();
var data=require('../models/data');
var user=require("../models/user");
var checklist=require('../models/checklist');
var  category=require('../models/category');
var acessToken=require('../models/acessTokens');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Members' });
});



router.get('/categories',function(req, res, next) {
		
		    var fullUrl = req.originalUrl;
		    res.cookie('previouspath',fullUrl);

		category.find({},function(err,cats){
				if(err)console.log(err)
				else{
				console.log(cats);	
    		res.render('partials/card.ejs',{cats:cats});
				}
			
			});
		
});



router.get('/checklist/:id',function(req, res) {
    console.log('sssssssssssssssssssssssss');
    
    if(req.user==undefined){
    console.log('HHHHHHHHHHHHHhh');       
    	 console.log(req.cookies.checklist);
    	 //console.log(length(req.cookies.length))
		if(req.cookies.checklist==undefined){
			// res.cookie('cdt_app_token', { overwrite: false});

        res.cookie("checklist", {data:[req.params.id]});
		}else{
			var a=[];
			var i;
			req.cookies.checklist['data'].forEach(function(i){
				a.push(i);
				});
				a.push(req.params.id)
				console.log(a)
			res.cookie("checklist",{data:a});
		}
    	
        res.redirect('/');
    }
    else{
        console.log('SSSSSS');
        checklist.create({user:req.user,data:req.params.id},function(err,data){
        if(err)console.log(err);
        else
        return res.redirect('/');    
        })
    }
    
});
router.get('/checklist',function(req, res) {
    console.log('here111');
    if(req.user!=undefined){
        console.log('here111');
     checklist.find({user:req.user._id},{data:1,_id:0},function(err, acc) {
         if(err)console.log(err);
         var a=[];
         let result = acc.map(a => a.data);
         console.log(result)
         
         
         
         var query = {"_id": { $in : result }	}
				  data.find(query,function(err, d) {
				     if(err)console.log(err); 
				     console.log(d);
                	 res.render('general/checklist.ejs',{data:d});
            	  }); 
         
         });
            
     
     
    }else
    {
        
                
                var i;
                var a = [];
                if(req.cookies.checklist==undefined){
                					req.flash('success','your checklist is empty');
                	                  res.render('general/checklist.ejs',{data:[]});
                }else{
                var ids=req.cookies.checklist['data']
                 var query = {
							     "_id": { $in : ids }
				
							}
				  data.find(query,function(err, d) {
				     if(err)console.log(err); 
                  res.render('general/checklist.ejs',{data:d});
            	  }); 
                }
           
    }
    
});

router.get('/downloaddata',function(req, res) {
   res.render('general/accessfile.ejs'); 
});
router.post('/getdata',ensureAuthenticated,function(req,res){
	
	acessToken.find({$and: [{user:req.user._id}, {token:req.body.token}] },function(err, d) {
		if(err)console.log(err);
		console.log(req.body.token);
		console.log(req.user._id);
		
		console.log(d);
		if(d==undefined || d.length==0){
			req.flash('success','Logins or Token is incorrect');
					res.redirect('/');
		}
		else{
		data.findById({"_id":d[0].data},function(err,data){
			if(err)console.log(err);
				if(data.filepath.length!=0){
					let x = data.filepath;
					console.log(data.filepath)
					res.render('general/download.ejs',{filepath:x});
				}else{
					req.flash('success','Logins or Token is incorrect');
					res.redirect('/');
				}
			
			});	
		} 
	});
	
	
	
});

router.post('/download', function(req, res){
  console.log('here');
  var file = req.body.filepath;
  console.log(file);
  res.download(file); // Set disposition and send it.
  //res.send('sdasd');
});



function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
