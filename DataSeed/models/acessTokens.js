var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/dataseed');

var db = mongoose.connection;

// User Schema
var tokenSchema = mongoose.Schema({
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    },
    data:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"data"
    },
    token:{
      type:String
    }
	
});

var acessToken = module.exports = mongoose.model('acessToken', tokenSchema);

