var express = require('express');
var app = express();

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

app.listen(3000, function () {
  console.log("App listening on port 3000!");
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
