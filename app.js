
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , socket = require('socket.io')
  , fs = require('fs')
  , readline = require('readline')
  , stream = require('stream');

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

/*
io.sockets.on('connection', function (socket) {
  socket.on('msg', function (data) {
    io.sockets.emit('new', data);
  });
});
*/

var commandDir = './commands/';
var historyDir = './history/';


// use timer intervall to read the command dirctories
setInterval(function() { 

  // read single commands dir
  fs.readdir(commandDir, function (err,files){
    // step through all command files
    for (var i=0; i<files.length;i++){
      // copy file name so that async remove function can use reference
      var _commandFile = JSON.parse( JSON.stringify( files[i] ) );



      // read file content
      var _commandContent = (fs.readFileSync(commandDir+files[i], 'utf8'));

      var data = {
          id:_commandFile,
          cmd:_commandContent
      };

      // print content on console (for debug purposes only)
      console.log(_commandFile + ': ' + _commandContent);

      // send content to all registred clients
      io.sockets.emit('new',data);
      
      // remove commandFile, use sync because otherwise the file might still exist in the next run
      fs.unlinkSync(commandDir+files[i]);
    }
  });

  // read history files dir
  fs.readdir(historyDir, function (err,files){
  // step through all command files
    for (var i=0; i<files.length;i++){
      console.log('Processing ' + files[i]);
      var _historyFile = JSON.parse( JSON.stringify( files[i] ) );
      var instream = fs.createReadStream(historyDir+_historyFile);
      var outstream = new stream;
      var rl = readline.createInterface(instream, outstream);

      var removeFile = function(file){
        console.log("finished reading: " + file);
        fs.unlinkSync(historyDir+file);
      }

      rl.on('line', function(line) {
        console.log('Processing line: ' + line);
        var regex = /([0-9]+) (.*)/
        var result = line.match(regex);
        var _id = result[1];
        var _cmd = result[2];

        var data = {
          id:_id,
          cmd:_cmd
        };
        console.log(_id + ': ' + _cmd);

        io.sockets.emit('new',data);


      });

      rl.on('close', function(){
        removeFile(_historyFile);
      });
    }
  });


  console.log("setInterval: It's been one second!"); 
}, 1000);
