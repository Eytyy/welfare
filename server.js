const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require('glob');
const AWS = require('aws-sdk');

const port = process.env.PORT || 3000;
const router = express.Router();

AWS.config.update({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
});

const s3 = new AWS.S3();

app.use(express.static('app'));

app.get('/', function(req, res) {
  res.sendfile('./app/index.html');
  res.end();
});
app.get('/resources/images/:layer/:id', function(req, res) {
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Delimiter: '/',
    Prefix: `welfare/${req.params.layer}/${req.params.id}/Photo/`
  };
  console.log(req.params.layer);
  console.log(req.params.id);

  s3.listObjects(s3Params, function(err, data) {
    if (err) {
      console.error('There was an error reading the file!', err);
    }
    data.Contents.forEach(function(file) {
      console.log(file.Key);
    });
    sendResponse(data.Contents);
  });

  function sendResponse(results) {
    res.json({ data: results});
    res.end();
  }

  // fs.readdir(fullpath, function(err, data) {
  //   // If direcotry doesn't exist
  //   if (err) {
  //     console.error('There was an error reading the file!', err);
  //     sendResponse();
  //     return;
  //   }
  //   // Otherwise handle data
  //   data.forEach(function(file) {
  //     file = path + '/' + file;
  //     results.push(file);
  //   });
  //   sendResponse(results);
  // });
});
app.get('/resources/other/:layer/:id', function(req, res) {
  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Delimiter: '/',
    Prefix: `welfare/${req.params.layer}/${req.params.id}/Misc`
  };
  s3.listObjects(s3Params, function(err, data) {
    if (err) {
      console.error('There was an error reading the file!', err);
    }
    console.log(data.Contents);
    sendResponse(data.Contents);
  });

  function sendResponse(results) {
    res.json({ data: results});
    res.end();
  }
  //
  // fs.readdir(fullpath, function(err, data) {
  //   // If direcotry doesn't exist
  //   if (err) {
  //     console.error('There was an error reading the file!', err);
  //     sendResponse();
  //     return;
  //   }
  //   // Otherwise handle data
  //   data.forEach(function(file) {
  //     file = path + '/' + file;
  //     results.push(file);
  //   });
  //   sendResponse(results);
  // });
});

app.listen(port);
console.log('on port', port);
