const express = require('express');
const path = require('path');

const app = express();

app.use('/js', express.static(__dirname + '/dist/js'));
app.use('/css', express.static(__dirname + '/dist/css'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(3333, (err) => {
  if(err) {
    console.log(err);
    return;
  }

  console.log(`Listening @ port 3333`);
});
