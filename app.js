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
app.use('/static', express.static('public'));
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
  ],
  showReminder: Boolean
});
WwiwoModel = mongoose.model('Wwiwo', wwiwoSchema);

// The home page
app.get('/', function (req, res) {
  res.render('home');
});

// Create a new document, save it to the database, get an ID, and redirect the
// user to the new page.
app.post('/create', function (req, res) {
  var wwiwoDocument = new WwiwoModel({
    tasks: [
      {
        name: 'My task',
        state: 'I\'m in the middle of...',
        nextSteps: 'Next I should...'
      }
    ],
    showReminder: true
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
    var showReminder = foundDocument.showReminder !== false;
    res.render('wwiwo', {task: task, showReminder: showReminder});
  });
});

// Update the page for a particular ID
app.post('/wwiwo/:id', function (req, res) {
  WwiwoModel.findByIdAndUpdate(req.params.id,
    {
      tasks: [req.body.updatedTask],
      showReminder: req.body.showReminder
    }, {new: true}, function (err, savedDocument) {
      if (err) return console.error(err);
      res.json({
        task: savedDocument.tasks[0],
        showReminder: savedDocument.showReminder
      });
    }
  );
});

// Launch app
port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('App listening on port ' + port + '!');
});
