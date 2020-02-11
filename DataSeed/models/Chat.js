const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/dataseed');
var db = mongoose.connection;

const chatSchema = new mongoose.Schema({
  name: String,
  // sender:{
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:"user"
  //   },
    // reciever:{
    //   type:mongoose.Schema.Types.ObjectId,
    //   ref:"user"
    // },
    sender:String,
    reciever:String,
  message: String
});

var chat=module.exports = mongoose.model('chat', chatSchema);
