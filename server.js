const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require('glob');
const AWS = require('aws-sdk');

const port = process.env.PORT || 3000;
const router = express.Router();

app.use(express.static('app'));

app.get('/', function(req, res) {
  res.sendfile('./app/index.html');
  res.end();
});
app.get('/resources/images/:layer/:id', function(req, res) {
  let results = [];
  const s3 = new AWS.S3();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Delimiter: '/',
    Prefix: `welfare/${req.params.layer}/${req.params.id}/Photo`
  };
  s3.listObjects(params, function(err, data) {
    if (err) {
      console.error('There was an error reading the file!', err);
    }
    console.log(data);
    results.push(data);
    sendResponse(results);
  });

  // const dir__name = './app'
  // const path = `http://s3.amazonaws.com/eytyy.com/welfare/${req.params.layer}/${req.params.id}/Photo`;
  // const fullpath =  `${path}`;

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
  let results = [];
  const s3 = new AWS.S3();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Delimiter: '/',
    Prefix: `welfare/${req.params.layer}/${req.params.id}/Misc`
  };
  s3.listObjects(params, function(err, data) {
    if (err) {
      console.error('There was an error reading the file!', err);
    }
    console.log(data);
    results.push(data);
    sendResponse(results);
  });

  // const dir__name = './app'
  // const path = `http://s3.amazonaws.com/eytyy.com/wlfare/${req.params.layer}/${req.params.id}/Misc`;
  // const fullpath =  `${path}`;
  //
  // let results = [];
  //
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
