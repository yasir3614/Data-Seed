
var express = require('express');
var router = express.Router();
var account=require("../models/account");
var randomstring = require("randomstring");
var data=require('../models/data');
var acessToken=require("../models/acessTokens");
var user=require("../models/user");
var reciept=require("../models/reciept");
var income=require("../models/income");
"use strict";
const nodemailer = require("nodemailer");


  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dataseedltd@gmail.com',
      pass: 'dataseed1'
    }
  });  
  
  
router.get('/',function(req,res){
  res.render('buyer/index.ejs');
});

router.get('/buy/:id',isloggedin,function(req,res){
	account.find({user:req.user},function(err,data){
		if(err)console.log(err);
		else{
				if(data.length==0)
				{	
					console.log('in /buyer/buy');
					req.flash('success','account is required');
					res.redirect('/general/account/setting');	}
				else{
				      console.log('------------');
				      console.log(req.params.id);
				      
					
					console.log('in here /buyer/buy');
						res.render('buyer/buy.ejs',{data:req.params.id});	
				}
			
			}
		
			
		});
});




 

router.post('/buy/:id',function(req,res){
  	 
  console.log('------++++++++++--------------h12');
  	  
  	 // var newReciept;
      var token=randomstring.generate(7);
      
      // var to=req.user.email;
      // var subject='Email Confirmation from dataSeed for Purchase';
      // var message='<h1>Thankyou for your purchase.</h1><p>Your verification Code is: <h2>'+token+'</h2></p>';
      // message=message+"<h3>You can view your reciept here:</h3><br>"+
      // "<a>https://dataseed-yasir3614.c9users.io/general/profile/"+req.user._id+"/mypurchases?</a>"+newReciept.creditcardnumber;
      // var mailOptions=sendmail(to,subject,message);
      
   
    
	  data.findById({"_id":req.params.id},function(err,data){
	    
	    console.log("DATA.USER --------------------------------------------------");
	    console.log(data.user);
	    
	    if(err)console.log(err);
	    else{
	      	  acessToken.create({user:req.user,data:req.params.id,token:token},function(err,acess){
	              if(err)console.log(err);
	              else{
	                  console.log("ACCESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSss");
	                    console.log(acess.user);
	                    
	                     {
                            console.log("------------------------------------------------------------------------------------TYPE OF USER ID: " + typeof(req.user._id));
                            
                            console.log(req.user._id);
                            account.findOne({"user":req.user._id},function(err,d){
                              console.log(err);
                              console.log(d);
                              if(err)console.log(err)
                                                      
                                    var tempaccount = d.toObject();
                                    
                                    var accountnumber = d.accountnumber;
                                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ACCOUNT NUMBER :  " + accountnumber);
                                    var amount=d.currentamount-data.price;
                                    var transferedamount=d.transferedamount+data.price;
                                    console.log("Amount: "+amount); // NaN
                                    
                                account.findByIdAndUpdate({user:req.user},{currentamount:amount,transferedamount:transferedamount},function(err,update){
                                  if(err)console.log(err);
                                    // console.log('Email sent: ' + info.response);
                                   
                                    user.findById({"_id":data.user},function(err,seller){
                                        if(err){
                                        console.log(err);
                                        }else{
                                        
                                          var buyer = req.user.username;
                                          var seller = seller.username;
                                          var priceOfData = data.price;
                                          //ccNumber undefined
                                          var ccnumber = d.accountnumber;
                                          
                                          
                                        console.log("Buyer Name " +buyer);
                                        console.log("Seller Name " +seller);
                                        console.log("Price " +priceOfData);
                                        console.log("Purchased on Credit Card Number " +ccnumber);
                                        console.log("TOKEN NUMBER: "+ token);
                                         
                                         

                                        var today = new Date();
                                        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                        var dateTime = date+' '+time;
                                        
                                         var newReciept = new reciept({
                                          datecreated:dateTime,
                                          datasetname: data.title,
                                          seller:seller,
                                          buyer:buyer,
                                          token:token,
                                          priceofdata:priceOfData,
                                          creditcardnumber:ccnumber
                                        });
                                      
                                          reciept.create(newReciept,function(err,generatedreciept){
                                            if(err){console.log(err);}
                                            console.log("RECIEPT GENERATED!1");
                                            console.log(generatedreciept);

                          
                                            income.findOne({incomename:"dataseedincome"},function(err,income){
                                              
                                              if(err) console.log(err);
                                              
                                              console.log(income);
                                              var incomeObject  = income.toObject(); 
                                              
                                              console.log(incomeObject);
                                              
                                              console.log(incomeObject.totalFunds);
                                              
                                              
                                              
                                              //array banain ya aisay he show karein samjh nahi araha
                                              //transaction model banatay hain
                                              //us mein current price, togive_seller, togive_dataseed, newIncome
                                              
                                              var newIncome = incomeObject.totalFunds + newReciept.priceofdata;
                                              
                                              
                                              console.log(newIncome);
                                              
                                              var to=req.user.email;
                                              var subject='Email Confirmation from dataSeed for Purchase';
                                              var message='<h1>Thankyou for your purchase.</h1><p>Your verification Code is: <h2>'+token+'</h2></p>';
                                              message=message+"<h2>Reciept For Your Purchase</h2><br>--------------------------------------------------<br>"+
                                              "<h3>Reciept Generated On: </h3>"+newReciept.datecreated+
                                             "<h4>Purchase Token (Confidential): </h4>"+newReciept.token+
                                             "<h4>Data Set Name: </h4>"+newReciept.datasetname+
                                              "<h4>Buyer Name: </h4>"+newReciept.buyer+
                                              "<h4>Seller Name: </h4>"+newReciept.seller+
                                              "<h4>Credit Card Number: </h4>"+newReciept.creditcardnumber+
                                              "<h4>Total: </h4>"+"$"+newReciept.priceofdata+
                                              "<br>--------------------------------------------------<p>Please save this reciept for future queries.</p><br>";
                                               var mailOptions=sendmail(to,subject,message);
                                              
                                              
                                            	transporter.sendMail(mailOptions, function(error, info){
                                                if (error) {
                                                    console.log(error);
                                                }
                                                
                                               
                                            });
                                                                      
                                              
                                              res.render('buyer/sold.ejs',{user:req.user});
                                              });
                                        
                                          }); 
                                          
                              		      // res.render('buyer/sold.ejs',{user:req.user});
                                		        
                                        }
                                      });
                                  });
                              });
                          }
	                    
	                    
                  	
	                }
	          });
	      }
	    });
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
			

function isloggedin(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}





module.exports = router;
