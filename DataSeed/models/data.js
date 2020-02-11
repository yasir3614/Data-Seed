var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/dataseed');

var db = mongoose.connection;

// User Schema
var dataSchema = mongoose.Schema({
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    },
	title: {
		type: String,
		index: true
	},
	category: {
		type: String
	},
	description: {
		type: String
	},
	tags:{
		type: String
	},
	price:{
		type: Number
	},
	rows_:{
	    type:Number
	},
	filepath:{
		type:String
	},
	reviews:[{
		type:String
	}],
	acceptedtokens:[{
			type:String
		}]
	
});

var data = module.exports = mongoose.model('data', dataSchema);

