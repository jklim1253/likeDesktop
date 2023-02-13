var express = require('express');
var app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(8888, () => {
  console.log('Server running at http://localhost:8888');
});