var express=require("express");
var router=express.Router();
const fileUpload = require('express-fileupload');
const csv = require('csv-parser');
const fs = require('fs');

// const crypto = require('crypto');
// const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
// const methodOverride = require('method-override');
// var mongoose = require('mongoose');
// var db = mongoose.connection;
// var path = require('path');

// var multer = require('multer');
// var upload = multer({dest: '../uploads'});
// let gfs;


// db.once('open', () => {
//   // Init stream
//   gfs = Grid(db.db, mongoose.mongo);
//   gfs.collection('uploads');
// });

// const storage = new GridFsStorage({
//   url: 'mongodb://localhost/dataseed',
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });

// router.get('/', (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files
    
//     if(err)console.log(err);
//     if (!files || files.length === 0) {
//       res.render('upload.ejs', { files: false });
//     } else {
//       files.map(file => {
//         if (
//           file.contentType === 'image/jpeg' ||
//           file.contentType === 'image/png'
//         ) {
//           file.isImage = true;
//         } else {
//           file.isImage = false;
//         }
//       });
//       res.render('upload.ejs', { files: files });
//     }
//   });
// });

// // @route POST /upload
// // @desc  Uploads file to DB
// router.post('/', upload.single('file'), (req, res) => {
//   // res.json({ file: req.file });
//   res.redirect('/upload');
// });

// // @route GET /files
// // @desc  Display all files in JSON
// router.get('/files', (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     // Check if files
    
//     if(err)console.log(err);
//     if (!files || files.length === 0) {
//       return res.status(404).json({
//         err: 'No files exist'
//       });
//     }

//     // Files exist
//     return res.json(files);
//   });
// });

// // @route GET /files/:filename
// // @desc  Display single file object
// router.get('/files/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
    
//     if(err)console.log(err);
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }
//     // File exists
//     return res.json(file);
//   });
// });

// // @route GET /image/:filename
// // @desc Display Image
// router.get('/image/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if file
//     if(err)console.log(err);
//     if (!file || file.length === 0) {
//       return res.status(404).json({
//         err: 'No file exists'
//       });
//     }

//     // Check if image
//     if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//       // Read output to browser
//       const readstream = gfs.createReadStream(file.filename);
//       readstream.pipe(res);
//     } else {
//       res.status(404).json({
//         err: 'Not an image'
//       });
//     }
//   });
// });

// // @route DELETE /files/:id
// // @desc  Delete file
// router.delete('/files/:id', (req, res) => {
//   gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
//     if (err) {
//       return res.status(404).json({ err: err });
//     }

//     res.redirect('/');
//   });
// });
// const express = require('express');
// app.use(fileUpload());
// tera code tha ye nichay tha dikha nahi XD kiya krna hai bata??
// const fileUpload = require('../upload.ejs');
// const app = express();

// app.use('/form', express.static(__dirname + '/index.html'));

// // default options
// app.use(fileUpload());

// app.get('/ping', function(req, res) {
//   res.send('pong');
// });

// app.post('/upload', function(req, res) {
//   let sampleFile;
//   let uploadPath;

//   if (Object.keys(req.files).length == 0) {
//     res.status(400).send('No files were uploaded.');
//     return;
//   }

//   console.log('req.files >>>', req.files); // eslint-disable-line

//   sampleFile = req.files.sampleFile;

//   uploadPath = __dirname + '/uploads/' + sampleFile.name;

//   sampleFile.mv(uploadPath, function(err) {
//     if (err) {
//       return res.status(500).send(err);
//     }

//     res.send('File uploaded to ' + uploadPath);
//   });
// });

router.use(fileUpload());

router.get('/uploadfile',function(req,res){
    
    res.render("upload.ejs");
    });
    
// var fs = require('fs');
// var parse = require('csv-parse');
 

    
    
    
    

router.post('/upload', function(req, res) {
  
    var fileStringName = req.body.filename;
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log(req.files);
  console.log(req.files.data);
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
 console.log(sampleFile);
//   Use the mv() method to place the file somewhere on your server
  sampleFile.mv('../csvs/'+fileStringName+'.csv', function(err) {
    if (err)
    
      return res.status(500).send(err);
    
    res.send('File uploaded!');
  });
});
// const fs = require('fs'); 
// const csv = require('csv-parser');

router.get('/readfile',function(req,res){
  
console.log("--------------------ReadFile");
var data=[]
fs.createReadStream('../csvs/testdata.csv')  
  .pipe(csv())
  .on('data', (row) => {
    console.log(row);
    // res.send("parsed");
    data.push(row);
    
  })
  .on('end', () => {
    res.render("data.ejs",{data:data});
    console.log('CSV file successfully processed');
  });
});

module.exports=router;


