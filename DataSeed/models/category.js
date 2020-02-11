var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/dataseed');

var db = mongoose.connection;

// User Schema
var categorySchema = mongoose.Schema({
    name:{
        type:String
    },
    img:{
        type:String
    },
    des:{
        type:String
    }
});

var category = module.exports = mongoose.model('category', categorySchema);

