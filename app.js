var express = require('express');
var app = express();
var path = require('path');

app.use('/public', express.static(path.join(__dirname + '/home')));

app.get('/', (req, res) => {
  res.redirect('/public');
});

app.get('*', (req, res) => {
  res.send('here is wrong page');
});

app.listen(8888, () => {
  console.log('Server running at http://localhost:8888');
});