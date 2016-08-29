var express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  app,
  port,
  dbUri,
  wwiwoSchema,
  WwiwoModel;

// Configure app settings
app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'pug');

// Connect to database
dbUri = 'mongodb://dbuser:dbpassword@dbh36.mlab.com:27367/heroku_8460h5zf';
mongoose.connect(dbUri, function(err) {
  if (err) {
    console.error(err.message);
    console.log('Failed connecting to MongoDB.');
  } else {
    console.log('Successfully connected to MongoDB.');
  }
});

// Set up database model
wwiwoSchema = mongoose.Schema({
  tasks: [
    {
      name: String,
      state: String,
      nextSteps: [String]
    }
  ]
});
WwiwoModel = mongoose.model('Wwiwo', wwiwoSchema);

// POST to /create creates a new document, saves it to the database, and
// redirects the user to the new page.
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

// The page for a particular ID
app.get('/wwiwo/:id', function (req, res) {
  var id = req.params.id;
  WwiwoModel.findById(id, function (err, foundDocument) {
    if (err) return console.error(err);
    var task = foundDocument.tasks[0];
    res.render('wwiwo', {task: task});
  });
});

// Updating a page
app.post('/wwiwo/:id', function (req, res) {
  console.log('Received POST for id: ' + req.params.id);
  console.log(req.body);
  WwiwoModel.findByIdAndUpdate(req.params.id, {tasks: [req.body.updatedTask]}, {new: true}, function (err, savedDocument) {
    if (err) return console.error(err);
    res.json(savedDocument.tasks[0]);
  });
});

// Launch app
port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('App listening on port ' + port + '!');
});
