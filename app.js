var express = require('express');
var app = express();

app.use(express.static('public'));

app.post('/create', function (req, res) {
  // Create unique id
  // Add id to list of ids in table
  // Create dummy data
  // Redirect to ?id=foo
  res.redirect('/foo');
});

app.get('/:id', function (req, res) {
  // Check if id exists
  // If exists, show results for id. Otherwise, show error.
  res.send('This the page with id: ' + req.params.id);
});

app.listen(3000, function () {
  console.log("App listening on port 3000!");
});
