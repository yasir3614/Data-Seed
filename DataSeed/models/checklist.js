var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/dataseed');

var db = mongoose.connection;

// User Schema
var checkList = mongoose.Schema({
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    },
    data:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"data"
    }
	
});

var checklist = module.exports = mongoose.model('checklist', checkList);

