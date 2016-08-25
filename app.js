var express = require('express');
var app = express();

app.use(express.static('public'));

app.post('/createPage', function (req, res) {
  res.send('Server received "createPage" message."');
});

app.listen(3000, function () {
  console.log("App listening on port 3000!");
});
