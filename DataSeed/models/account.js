var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/dataseed");

var db=mongoose.connection;

var accountSchema=mongoose.Schema({
     user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    },
    accountholder:{
        type:String
    },
    cvv:{
        type:String
    },
    expiryyear:{
    type:String
    },
    expirymonth:{
    type:String
    },
    accountnumber:{
        type:Number
    },
    currentamount:{
        type:Number
    },
    transferedamount:{
        type:Number
    },
    withdrawnamount:{
        type:Number    
    }
});

var account = module.exports = mongoose.model('account', accountSchema);