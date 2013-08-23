// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env];

// Modules
var restify = require("restify")
  , mongoose = require('mongoose')
  , fs = require('fs')
  , preflightEnabler = require('se7ensky-restify-preflight');

// Paths
var models_path = config.root + '/models'
var utils_path = config.root + '/jsUtil'
var config_path = config.root + '/config'

// Database
var connectStr = config.db_prefix +'://'+config.host+':'+config.db_port+'/'+config.db_database;
console.log(connectStr);
mongoose.connect(connectStr);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Database connection opened.");
});

// Bootstrap models
fs.readdirSync(models_path).forEach(function (file) {
  console.log("Loading model " + file);
  require(models_path+'/'+file);
});


// Bootstrap auth middleware
var auth = require(config_path + '/middlewares/authorization.js');

// Bootstrap JavaScript utilities
// globals considered bad, eventually this container should be rewritten into a module
globalUtil = {};
fs.readdirSync(utils_path).forEach(function (file) {
  console.log("Loading utility " + file);
  var variableName = file.substring(0, file.indexOf('.'));
  require(utils_path+'/'+file)(globalUtil, config, auth);
});
//console.log(globalUtil.generatePassword());

// Configure the server
var app = restify.createServer({
  //certificate: ...,
  //key: ...,
  name: 'crud-test',
  version: config.version
});

// allows authenticated cross domain requests
preflightEnabler(app);

// function to retrieve the session secret from the database
// checks for existing or creates one if none available
// avoids having to hardcode one in configuration and allows multiple
// servers to share the key
SessionKey = mongoose.model('SessionKey');
var sessionKey;
SessionKey.findOne({ key: /./ }, function (err, sessionKeyResult) {
  if (!err) {
    if (!sessionKeyResult) {
      // No key found, so create and store
      console.log('Setting up a new session key.');
      sessionKey = new SessionKey();
      sessionKey.key = (new mongoose.Types.ObjectId()).toString();
      sessionKey.save();
    } else {
      // use key founf in the database
      console.log('Retrieved session key from db.');
      sessionKey = sessionKeyResult;
    }

    // because we can't have a synchronous DB call, finish up the server setup here
    // restify settings
    require(config_path + '/restify')(app, config, sessionKey.key);

    // configure email
    var MailHelper = require(config_path + '/mail-helper.js').MailHelper;

    require(config_path + '/routes')(app, config, auth, new MailHelper(config));

    // configure Socket Server
    var SocketHelper_IO = require(config_path + '/socket-helper-socket-io.js').SocketHelper;
    new SocketHelper_IO(app, config);

    // Start the app by listening on <port>
    var port = process.env.PORT || config.port;
    app.listen(port);
    console.log('App started on port ' + port);
  } else {
    console.log("Failed to start server due to databse issue.");
    console.log(err);
  }
});





