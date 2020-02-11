var express=require('express');
var router=express.Router();
const csv = require('csv-parser');
const fs = require('fs');
var account=require('../models/account');
var data=require('../models/data');
var user=require("../models/user");
var checklist=require('../models/checklist');
var acessToken=require("../models/acessTokens");
var reciept = require("../models/reciept");
var redirectLink;

// router.get('/',function(req,res){
//         res.render('general/category.ejs');
        
// });

router.get('/:category',function(req,res){
    var fullUrl = req.originalUrl;
    res.cookie('previouspath',fullUrl);
   data.find({category:req.params.category},function(err,data){
       if(err){console.log(err);res.redirect('/')};
       if(data==null||data.length==0){
        req.flash('error','No Data found in this category.');
        return res.redirect('/');
      }
      else
      res.render('general/show.ejs',{data:data});
       });     
});
router.get('/detail/:title',function(req,res){
    var fullUrl = req.originalUrl;
    res.cookie('previouspath',fullUrl);
    
   data.findById({_id:req.params.title},function(err,data){
       if(err){console.log(err); return res.redirect('/')};
       if(data==null||data.length==0){
        req.flash('error','No Data found in this category.');
        return res.redirect('/');
      }
      console.log("--------------------ReadFile");
var file=[]
fs.createReadStream(data.filepath)  
  .pipe(csv())
  .on('data', (row) => {
    file.push(row);
    
  })
  .on('end', () => {
    // res.render("data.ejs",{data:data});
    res.render('general/detail.ejs',{data:data,file:file});
  
    console.log('CSV file successfully processed');
  });
  

      
      
      
       });     
});


router.get('/profile/:id',function(req, res) {
    console.log('-----in profile----');
    user.findById(req.params.id,function(err, user) {
        if(err)console.log(err);
        else{
            account.find({user:req.params.id},function(err, acc) {
               if(err)console.log(err);
               else{
                    acessToken.find({user:req.user._id},function(err, token) {
                        if(err)
                        {
                            console.log(err);
                        }
                          console.log(acc);
                          
                            
                        res.render('general/profile.ejs',{profile:user,account:acc});

                    }) ;   

                
               }
            });
        }
    });
});

router.get('/account/setting',function(req, res) {
    console.log('in here ---- /acc/set');
                res.render('general/accountform.ejs');    
          
});

  router.get('/profile/:id/mypurchases',function(req,res){
    
    var username;
    console.log(req.params.id);
    user.findOne({_id:req.params.id},function(err,founduser){
        if(err) console.log(err);
        
        var thisUser = founduser.toObject();
        username = thisUser.username;
        console.log("usernameeeeeeeeee: " + username) ;
        
        reciept.find({buyer:username},function(err,reciepts){
            if(err) console.log(err);
            res.render("general/mypurchases.ejs",{reciept:reciepts});
            });
        
        
        });
    
    
    
    // res.render("general/mypurchases.ejs",{userPurchases:userPurchases});
    });



router.post('/account/setting',function(req,res){
    // var check = req.body.accountcheck;
    // res.send(check);
    
     var acc=new account(
                  {
                    user:req.user._id,
                    accountholder:req.body.accountholder,
                    cvv:req.body.cvv,
                    expirymonth:req.body.expirymonth,
                    expiryyear:req.body.expiryyear,
                    accountnumber:req.body.accountnumber,
                    currentamount:10000,
                    transferedamount:1000,
                    withdrawnamount:0
                  });
                    
                  console.log(acc);
                  
                  account.create(acc,function(err,data){
                    if(err) console.log(err);
                    else{
                      console.log('here');
                      console.log(data);
                    req.flash('success','Congrats! your account is created you can checkout now.');
      
                    return res.redirect('/');
                  
                      }
                  });
                       
});




// router.get('/test',function(req,res){
//     res.render("/general/checklist.ejs");
//     });


module.exports=router;