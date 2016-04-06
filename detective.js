require('newrelic');

var express = require('express'),
    exphbs  = require('express-handlebars'),
    http = require('http'),
    socketio = require('socket.io'),
    mysql = require('mysql'),
    uuid = require('node-uuid'),
    moment = require('moment'),
    app = express(),
    server = http.Server(app),
    io = socketio.listen(server),
    globalReq;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.DB_PASSWORD,
  database : 'detective_db'
});


var unassignedUsers = [],
    rooms = [],
    loggingEnabled = false;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pairWithRobot(socket){
  if (loggingEnabled === true){
    console.log('Paired user with robot');
  }
  socket.emit('you are', 'detective');
  socket.emit('paired',
    {
      users: [
        socket.id,
        'robot'
      ]
    }
  );
}

function createRoom(){
  var newRoom = uuid.v1();
  if (rooms.indexOf(newRoom) > -1){
    createRoom();
  }
  else{
    rooms.push(newRoom);
//TODO: Find a more eloquent solution here
    if (getRandomInt(0, 1) === 0){
      detective = unassignedUsers.shift();
      impostor = unassignedUsers.shift();
    }
    else{
      impostor = unassignedUsers.shift();
      detective = unassignedUsers.shift();
    }
    detective.join(newRoom);
    impostor.join(newRoom);

    detective.emit('you are', 'detective');
    impostor.emit('you are', 'impostor');

    if (loggingEnabled === true){
      console.log('Paired two users');
    }

    io.to(newRoom).emit('paired',{
      users: [
        detective.id,
        impostor.id
      ]
    });
  }
}

function reassignUsers(socket){
  if (unassignedUsers.indexOf(socket) === -1){
    unassignedUsers.push(socket);
    if (unassignedUsers.length === 2){
      createRoom();
    }
  }
}

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  var banner_url = 'images/art/detective.png';
  if (getRandomInt(0, 1) === 0){
    banner_url = 'images/art/detective-man.png'
  }
    res.render('index', {
      banner_url: banner_url
    });
});

app.get('/play', function (req, res) {
  globalReq = req;
  res.render('play');
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.get('/log', function (req, res) {
  if (loggingEnabled === true){
    console.log('Getting log for ID = ' + req.query.id);
  }
  connection.query('SELECT * from detective WHERE id = ?', [req.query.id], function(err, rows, fields) {
    if (!err){
      var chat_log, last_update, played_by = '';
      if (rows.length > 0){
        chat_log = rows[0].chat_log;
        last_update = moment(rows[0].time).fromNow();
        var user_role = rows[0].user_role;

        if (user_role === 'detective' || user_role === 'impostor'){
          played_by = "Played by " + user_role.toUpperCase();
        }
      }
      else{
        chat_log = '<ul id="messages"><li class="system-message error-message">There is no record for this ID</li></ul>';
        last_update = '';
      }
      res.render('log', {
        chat_log: chat_log,
        played_by: played_by,
        last_update: last_update
      });

    }
    else{
      console.log('Error while performing Query.');
      console.log(err);
    }
  });
});

app.use(express.static(__dirname + '/public'));

server.listen(3003, function(){
  console.log('Express server listening on port 3003');
});

io.on('connection', function (socket) {
  if (getRandomInt(0, 2) !== 0){
// This is for testing, replace the line above.
//  if (1 === 0){
    reassignUsers(socket);
    if (loggingEnabled === true){
      console.log('Waiting for a new connection');
    }
  }
  else{
    var connectionDelay;
    if (getRandomInt(0, 1) === 0){
      connectionDelay = getRandomInt(100, 1000);
    }
    else{
      connectionDelay = getRandomInt(3000, 30000);
    }
    if (loggingEnabled === true){
      console.log('Pairing with a robot in ' + connectionDelay + ' ms');
    }
    setTimeout(function(){
      pairWithRobot(socket);
    }, connectionDelay);
  }

  if (loggingEnabled === true){
    console.log('connected:' + socket.id);
  }
  socket.emit('connected', { status: 'connected' });

  socket.on('send message', function(data){
    if (loggingEnabled === true){
      console.log('message received:');
      console.log(data);
    }
    data.message = data.message.replace(/(<([^>]+)>)/ig,"");
    if (data.message.length > 0){
      socket.rooms.forEach(function(room){
        socket.to(room).emit('message received', data);
      });
    }
  });

  socket.on('game over', function(status){
      socket.rooms.forEach(function(room){
        socket.to(room).emit('game over', status);
      });
  });

  socket.on('save_chat_log', function(chatLog, userRole){
    if (loggingEnabled === true){
      console.log('Saving chat log');
    }
    connection.query('INSERT INTO detective (chat_log, user_role, time) VALUES (?, ?, now())', [chatLog, userRole],
      function(err, info) {
        if (!err){
          socket.emit('chat_log_saved', info.insertId);
        }
        else{
          console.log('Error while performing Query.');
          console.log(err);
          socket.emit('error', err);
        }
      });
    });

  socket.on('disconnect', function(){
    if (loggingEnabled === true){
      console.log('disconnected: ' + socket.id);
      console.log(socket.rooms);
      console.log(io.sockets.rooms);
    }
    var index = unassignedUsers.indexOf(socket);

    if (index > -1) {
        unassignedUsers.splice(index, 1);
    }
    if (loggingEnabled === true){
      console.log(unassignedUsers.length);
    }
  });

  socket.onclose = function(reason){
    var rooms = socket.adapter.sids[socket.id];
    for (var room in rooms){
      if (reason === 'ping timeout'){
        socket.to(room).emit('partner disconnected, ping timeout', socket.handshake.address);
      }
      else{
        socket.to(room).emit('partner disconnected', reason);
      }
    }
    if (loggingEnabled === true){
      console.log(socket.adapter.sids[socket.id]);
    }
    Object.getPrototypeOf(this).onclose.call(this,reason);
  }
});
