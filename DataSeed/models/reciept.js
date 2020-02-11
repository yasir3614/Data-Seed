const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/dataseed');
var db = mongoose.connection;

const recieptSchema = new mongoose.Schema({
  datasetname:String,
  seller:String,
  buyer:String,
  priceofdata:Number,
  creditcardnumber:Number,
  token:String,
  datecreated: String
});

var reciept=module.exports = mongoose.model('reciept', recieptSchema);
