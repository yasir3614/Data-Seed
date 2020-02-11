
var express = require('express');
var router = express.Router();
var data =require('../models/data');
var category=require("../models/category");




router.get('/',function(req,res){
  res.render('seller/index.ejs');
});

router.get('/sell',function(req,res){
  category.find({},function(err, cats) {
      if(err)console.log(err);
      else
        res.render('seller/sellform.ejs',{cats:cats});      
  });


});
const fileUpload = require('express-fileupload');
const csv = require('csv-parser');
const fs = require('fs');
router.use(fileUpload());

router.post('/sell',function(req,res){
console.log('post');

  data.find({title:req.body.title,user:req.user._id},function(err, check) {
     if(err)console.log(err);
     else
     {
       if(check.length==0){
         
                  var fileStringName = req.body.filename;  
                  if (Object.keys(req.files).length == 0) {
                    
                    return res.status(400).send('No files were uploaded.');
                
                  }
                  let sampleFile = req.files.sampleFile;
                var dir = '../files/'+req.user.username+'/';
                
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }
                  sampleFile.mv(dir+req.body.title+'.csv', function(err) {
                    if (err){
                        console.log(err);
                        console.log('err');
                      return res.status(500).send(err);
                    }
                    else{
                      console.log('else');
                    var Data=new data(
                  {
                    
                  user:req.user._id,
                	title:req.body.title,
                	category:req.body.category,
                	description:req.body.description,
                	tags:req.body.tags,
                	price:req.body.price,
                	rows_:req.body.rows_,
                	filepath:dir+req.body.title+'.csv'
                  });
                  
                  
                  data.create(Data,function(err,data){
                    if(err) console.log(err);
                    else{
                    res.redirect('/seller/');
                  
                      }
                  });
                
                    
                    
                    }
                    
                    
                  });         
         }
         else{
            req.flash('success','this '+req.body.title+' title already exist')
            res.redirect('/seller/sell')
         }
     }
  });
  

  /*
  var fileStringName = req.body.filename;
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log(req.files);
  console.log(req.files.data);
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
 console.log(sampleFile);
//   Use the mv() method to place the file somewhere on your server
  sampleFile.mv('../csvs/'+fileStringName+'.csv', function(err) {
    if (err)
    
      return res.status(500).send(err);
    
    res.send('File uploaded!');
  });
  */
  
  
  
  
    


});
router.get('/mydata',function(req,res){
  data.find({user:req.user},function(err,data){
    if(err)console.log(err);
         if(data==null){
       req.flash('error','No Data found in this category.');
    res.redirect('/');
      }
      res.render('general/show.ejs',{data:data});
  
  
    });  
  
});
module.exports = router;
