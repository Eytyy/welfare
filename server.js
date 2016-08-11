const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require('glob');

const port = process.env.PORT || 3000;
const router = express.Router();

app.use(express.static('app'));

app.get('/', function(req, res) {
  res.sendfile('./app/index.html');
  res.end();
});
app.get('/resources/:layer/:id', function(req, res) {
  const dir__name = './app'
  const path = `/resources/${req.params.layer}/${req.params.id}/Photo`;
  const fullpath =  `${dir__name}${path}`;

  let results = [];

  function sendResponse(results) {
    res.json({ data: results});
    res.end();
  }

  fs.readdir(fullpath, function(err, data) {
    // If direcotry doesn't exist
    if (err) {
      console.error('There was an error reading the file!', err);
      sendResponse();
      return;
    }
    // Otherwise handle data
    data.forEach(function(file) {
      file = path + '/' + file;
      results.push(file);
    });
    sendResponse(results);
  });

});

app.listen(port);
console.log('on port', port);
