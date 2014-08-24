
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , socket = require('socket.io')
  , fs = require('fs');

var app = module.exports = express.createServer();

var io = socket.listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

io.sockets.on('connection', function (socket) {
  socket.on('msg', function (data) {
    io.sockets.emit('new', data);
  });
});

var commandDir = './commands/';


// use timer intervall to read periodically the commands dir
setInterval(function() { 
  fs.readdir(commandDir, function (err,files){
    // step through all command files
    for (var i=0; i<files.length;i++){
      // copy file name so that async remove function can use reference
      var _commandFile = JSON.parse( JSON.stringify( files[i] ) );

      // read file content
      var _commandContent = (fs.readFileSync(commandDir+files[i], 'utf8'));

      // print content on console (for debug purposes only)
      console.log(_commandFile + ': ' + _commandContent);

      // send content to all registred clients
      io.sockets.emit('new',_commandContent);
      
      // remove commandFile, use sync because otherwise the file might still exist in the next run
      fs.unlinkSync(commandDir+files[i]);
    }
  });
  console.log("setInterval: It's been one second!"); 
}, 1000);
