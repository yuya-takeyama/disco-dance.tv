
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer()
  , io = require('socket.io').listen(app);

var Counter = require('./lib/counter').Counter
  , counter = new Counter;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
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

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

io.sockets.on('connection', function (socket) {
  socket.emit('hello', "Hello, I'm Disco-Dance.tv server!");

  counter.incr();
  io.sockets.emit('counter', counter.count);

  socket.on('play', function (data) {
    socket.broadcast.emit('play', data);
  });

  socket.on('disconnect', function () {
    counter.decr();
    io.sockets.emit('counter', counter.count);
  });
});
