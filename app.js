var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

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

var wwiwoSchema = mongoose.Schema({
  tasks: [
    {
      name: String,
      state: String,
      nextSteps: [String]
    }
  ]
});
var WwiwoModel = mongoose.model('Wwiwo', wwiwoSchema);

app.use(express.static('public'));

app.post('/create', function (req, res) {
  var wwiwoDocument = new WwiwoModel({
    tasks: [
      {
        name: 'My task',
        state: 'I\'m in the middle of...',
        nextSteps: [
          'Step 1',
          'Step 2'
        ]
      }
    ]
  });
  wwiwoDocument.save(function (err, savedWwiwoDocument) {
    if (err) return console.error(err);
    var id = savedWwiwoDocument.id;
    res.redirect('/wwiwo/' + id);
  });
});

app.get('/wwiwo/:id', function (req, res) {
  var id = req.params.id;
  WwiwoModel.findById(id, function (err, foundDocument) {
    if (err) return console.error(err);
    var task = foundDocument.tasks[0];
    res.render('wwiwo', {task: task});
  });
});

app.post('/wwiwo/:id', function (req, res) {
  console.log('Received POST for id: ' + req.params.id);
  console.log(req.body);
  WwiwoModel.findByIdAndUpdate(req.params.id, {tasks: [req.body.updatedTask]}, {new: true}, function (err, savedDocument) {
    if (err) return console.error(err);
    res.json(savedDocument.tasks[0]);
  });
});

app.set('view engine', 'pug');

app.listen(port, function () {
  console.log('App listening on port ' + port + '!');
});
