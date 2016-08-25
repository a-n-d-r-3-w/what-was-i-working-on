var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

var mongoose = require('mongoose');
var productionUri = 'mongodb://dbuser:dbpassword@dbh36.mlab.com:27367/heroku_8460h5zf';
mongoose.connect(productionUri, function(err) {
  if (err) {
    console.error(err.message);
    console.log('Failed connecting to MongoDB.');
  } else {
    console.log('Successfully connected to MongoDB.');
  }
});

app.use(express.static('public'));

app.post('/create', function (req, res) {
  var id = generateId();
  // Create unique id
  // Add id to list of ids in table
  // Create dummy data
  // Redirect to ?id=foo
  res.redirect('/' + id);
});

app.get('/:id', function (req, res) {
  // Check if id exists
  // If exists, show results for id. Otherwise, show error.
  res.send('This the page with id: ' + req.params.id);
});

app.listen(port, function () {
  console.log('App listening on port ' + port + '!');
});

function generateId() {
  const CHARACTERS = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var id = '';
  var i;
  for (i = 0; i < 16; i++) {
    var randomIndex = Math.floor(Math.random() * CHARACTERS.length);
    id += CHARACTERS[randomIndex];
  }
  return id;
}
