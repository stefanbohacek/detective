var config = require('./config'),
    express = require('express'),
    exphbs  = require('express-handlebars'),
    http = require('http'),
    socketio = require('socket.io'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    mysql = require('mysql'),
    uuid = require('node-uuid'),
    moment = require('moment'),
    app = express(),
    server = http.Server(app),
    io = socketio.listen(server),
    globalReq,
    Session = require('express-session'),
    SessionStore = require('session-file-store')(Session),
    session = Session({store: new SessionStore({path: __dirname + '/tmp/sessions'}),
                                               secret: config.secret,
                                               resave: true,
                                               saveUninitialized: true
                      }),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy;

if (process.env.NODE_ENV === 'production'){
  config.twitter.callbackURL = 'http://fourtonfish.com/detective/auth/twitter/callback';
}

passport.use(new TwitterStrategy(config.twitter,
  function(token, tokenSecret, profile, cb) {
    //console.log(profile.username);
    // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    return cb(null,profile);
  }
));

passport.serializeUser(function(user, done) {
  // console.log('serializeUser');
  // console.log(user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  // console.log('deserializeUser');
  // console.log(obj.username);
  done(null, obj);
});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.DB_PASSWORD,
  database : 'detective_db'
});


var unassignedUsers = [],
    rooms = [],
    loggingEnabled = true;

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

app.use(session); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session


app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/detective/play');
  });

app.get('/', function (req, res) {
  var banner_url = 'images/art/detective.png';
  if (getRandomInt(0, 1) === 0){
    banner_url = 'images/art/detective-man.png'
  }
    res.render('index', {
      banner_url: banner_url,
      // TODO: Find a better way to solve this!      
      production_url_fix: process.env.NODE_ENV === 'production' ? '/detective' : '',
      userIsLoggedIn: ( req.session && req.session.passport && req.session.passport.user ) ? true : false,
      userName: ( req.session && req.session.passport && req.session.passport.user ) ? req.session.passport.user.username : null
    });
});

app.get('/play', function (req, res) {
  globalReq = req;
  if (req.session && req.session.passport && req.session.passport.user){
    console.log(req.session.passport.user.username);
    console.log(req.session.passport.user.id);

    var user = null;


    connection.query('SELECT * from users WHERE service_uid = ' + req.session.passport.user.id, function(err, rows, fields) {
      if (!err){
        if (rows.length > 0){
          user = {
            service: rows[0].service,
            service_uid: rows[0].service_uid,
            user_id: rows[0].user_id,
            user_name: rows[0].user_name,
            total_games: rows[0].total_games,
            played_as_detective: rows[0].played_as_detective,
            won_as_detective: rows[0].won_as_detective,
            played_as_impostor: rows[0].played_as_impostor,
            won_as_impostor: rows[0].won_as_impostor,
            date_joined: rows[0].date_joined
          };
          console.log('user logged in...');
          req.session.detective_user = user;
          console.log(user);
          if(user.user_name){
            res.render('play', {
              user_name: '@' + user.user_name
            });
          }
          else{
            res.render('play', { user_name: '' });
          }
        }
        else{
          console.log('new user');


          console.log('req.session.passport.user.id');
          console.log(req.session.passport.user.id);

          connection.query('INSERT INTO users (service,service_uid,user_name,total_games,played_as_detective,won_as_detective,played_as_impostor,won_as_impostor,date_joined) VALUES ("twitter","' + req.session.passport.user.id + '","' + req.session.passport.user.username + '",0,0,0,0,0,now())',
            function(err, info) {
              if (!err){
                console.log('new user saved!');
                user = {
                  user_id: info.insertId,
                  service: "twitter",
                  service_uid: req.session.passport.user.id,
                  user_name: req.session.passport.user.username,
                  total_games: 0,
                  played_as_detective: 0,
                  won_as_detective: 0,
                  played_as_impostor: 0,
                  won_as_impostor: 0,
                };
                console.log(user);
                if(user.user_name){
                  res.render('play', { user_name: '@' + user.user_name });
                }
                else{
                  res.render('play', { user_name: '' });
                }
              }
              else{
                console.log('Error while performing Query.');
                console.log(err);
              }
            });
        }
      }
      else{
        console.log('Error while performing Query.');
        console.log(err);
      }
    });
  }
  else{
    console.log('user not logged in');
    res.render('play', { user_name: '' });
    
  }
});

app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/detective/');
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.get('/log', function (req, res) {
  if (loggingEnabled === true){
    console.log('Getting log for ID = ' + req.query.id);
  }
  connection.query('SELECT * from detective WHERE id = ' + req.query.id, function(err, rows, fields) {
    if (!err){
      var chat_log, last_update, played_by = '';
      if (rows.length > 0){
        chat_log = unescape(rows[0].chat_log);
        last_update = moment(rows[0].time).fromNow();
        var user_role = unescape(rows[0].user_role);

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

app.get('/leaderboard', function (req, res) {
  var order_by = 'total_games',
      sort = req.query.sort,
      sortDetectives = false,
      sortImpostors = false;

  switch(req.query.sort){
    case 'detective':
      order_by = 'won_as_detective/played_as_detective DESC, won_as_detective DESC';
      sortDetectives = true;
    break;
    case 'imposter':
    case 'impostor':
      order_by = 'won_as_impostor/played_as_impostor DESC, won_as_impostor DESC';
      sortImpostors = true;
    break;
    default:
      order_by = 'total_games DESC';
  }

  var exclude_from_leaderboard = ' WHERE 1 ';

  if (process.env.NODE_ENV === 'production'){
    exclude_from_leaderboard = ' WHERE user_name <> "fourtonfish" AND user_name <> "botwikidotorg" ';
  }

  connection.query('SELECT * from users' + exclude_from_leaderboard + 'LIMIT 25 ORDER BY ' + order_by, function(err, rows, fields) {
    if (!err){
      var data;
      res.render('leaderboard', {
          rows: rows,
          sortDetectives: sortDetectives,
          sortImpostors: sortImpostors
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

var ios = require('socket.io-express-session');

io.use(ios(session));



io.on('connection', function (socket) {
  try{
    console.log('Connected as:');
    console.log(socket.handshake.session.passport.user.username);
  }
  catch(err){
    console.log(err);
  }
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
      console.log(socket.rooms);
      console.log(data);
    }
    data.message = data.message.replace(/(<([^>]+)>)/ig,"");
    if (data.message.length > 0){
      for (var room in socket.rooms) {
        console.log(socket.rooms[room]);
        socket.to(socket.rooms[room]).emit('message received', data);  
      }
    }
  });

  socket.on('game over', function(status){
    console.log('game over...');
    for (var room in socket.rooms) {
      console.log(socket.rooms[room]);
      socket.to(socket.rooms[room]).emit('game over', status);  
    }
  });

  socket.on('I won', function(role){
    console.log('########################WINNER############');
    console.log(role);

    if (socket.handshake.session.detective_user){
      connection.query('SELECT * from users WHERE user_name = "' + socket.handshake.session.detective_user.user_name + '"', function(err, rows, fields) {
        if (!err){
          if (rows.length > 0){
            fetched_user = {
              user_name: rows[0].user_name,
              total_games: parseInt(rows[0].total_games),
              played_as_detective: parseInt(rows[0].played_as_detective),
              won_as_detective: parseInt(rows[0].won_as_detective),
              played_as_impostor: parseInt(rows[0].played_as_impostor),
              won_as_impostor: parseInt(rows[0].won_as_impostor)
            };
            console.log('fetched_user:');
            console.log(fetched_user);

            switch(role){
              case 'detective':
                var updated_score = ', played_as_detective = ' + (fetched_user.played_as_detective + 1);
                    updated_score += ', won_as_detective = ' + (fetched_user.won_as_detective + 1);
              break;
              case 'impostor':
                var updated_score = ', played_as_impostor = ' + (fetched_user.played_as_impostor + 1);
                    updated_score += ', won_as_impostor = ' + (fetched_user.won_as_impostor + 1);
              break;
            }

            connection.query('UPDATE users SET total_games = ' + (fetched_user.total_games + 1) + updated_score + ' WHERE user_name = "' + fetched_user.user_name + '"',
              function(err, info) {
                if (err){
                  console.log('Error while performing Query.');
                  console.log(err);
                }
              });
          }
        }
        else{
          console.log('Error while performing Query.');
          console.log(err);
        }
      });
    }





  });

  socket.on('I lost', function(role){
    console.log('#########################LOSER############');
    console.log(role);


    if (socket.handshake.session.detective_user){
      connection.query('SELECT * from users WHERE user_name = "' + socket.handshake.session.detective_user.user_name + '"', function(err, rows, fields) {
        if (!err){
          if (rows.length > 0){

            fetched_user = {
              user_name: rows[0].user_name,
              total_games: parseInt(rows[0].total_games),
              played_as_detective: parseInt(rows[0].played_as_detective),
              won_as_detective: parseInt(rows[0].won_as_detective),
              played_as_impostor: parseInt(rows[0].played_as_impostor),
              won_as_impostor: parseInt(rows[0].won_as_impostor)
            };

            console.log('fetched_user:');
            console.log(fetched_user);

            switch(role){
              case 'detective':
                var updated_score = ', played_as_detective = ' + (fetched_user.played_as_detective + 1);
              break;
              case 'impostor':
                var updated_score = ', played_as_detective = ' + (fetched_user.played_as_impostor + 1);
              break;
            }

            connection.query('UPDATE users SET total_games = ' + (fetched_user.total_games + 1) + updated_score + ' WHERE user_name = "' + fetched_user.user_name + '"',
              function(err, info) {
                if (err){
                  console.log('Error while performing Query.');
                  console.log(err);
                }
              });
          }
        }
        else{
          console.log('Error while performing Query.');
          console.log(err);
        }
      });

    }
  });

  socket.on('save_chat_log', function(chatLog, userRole){
    if (loggingEnabled === true){
      console.log('Saving chat log');
    }
    connection.query('INSERT INTO detective (chat_log, user_role, time) VALUES ("' + escape(chatLog) + '","'+ escape(userRole) +'",now())',
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