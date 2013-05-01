var sockets = require('json-sockets')
  , net = require('net')
  , JsonSocket = require('json-socket');

var server = net.createServer();

/**
 * Generates a SocketHelper
 *
 * @constructor
 * @param {Object} options
 */
var SocketHelper = function(config) {
    this.initialize(config);
}

/**
 * Initializes properties
 *
 * @constructor
 * @param {Object} options
 */


SocketHelper.prototype.initialize = function(appConfig) {
  server.listen(appConfig.socket_port);
  console.log("Web socket listening on port " + appConfig.socket_port);
  server.on('connection', function(socket) { //This is a standard net.Socket
      socket = new JsonSocket(socket); //Now we've decorated the net.Socket to be a JsonSocket
      socket.on('message', function(message) {
          var isRunning = false;
          var streatTimeout;
          socket.on('message', function(message) {
            if (message.command == 'start') {
                if (!isRunning) {
                    isRunning = true;
                    streamInterval = setInterval(function() {
                        socket.sendMessage(new Date());
                    }, 1000);
                }
            } else if (message.command == 'stop') {
                if (isRunning) {
                    isRunning = false;
                    clearInterval(streamInterval);
                }
            }
          });
      });
  });
  /* json-sockets
    sockets.listen(appConfig.socket_port, function(socket) {
        socket.on('message', function(message) {
            socket.send(message); // echo
        });
    });
    */
};


// Export SocketHelper constructor
module.exports.SocketHelper = SocketHelper;
