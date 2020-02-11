var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/dataseed');

var db = mongoose.connection;

// User Schema
var incomeSchema = mongoose.Schema({
   incomename: String,
   totalfunds: Number,
   commisionRate: Number
});

var income = module.exports = mongoose.model('income', incomeSchema);

