'use Strict'
var express = require('express');

var app = express();
app.set('port', process.env.PORT || 9000);
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = app.get('port');
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var userAction = require('./userAction')
var config = require('./config')
var bcrypt = require('bcrypt')

var path = require('path')

mongoose.connect(config.db)


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.use(express.static('public'));

server.listen(port, function () {
    console.log("Server listening on: http://localhost:%s", port);
});

app.use(express.static(path.join(__dirname, 'chat2/app')));
app.get('/', function (req, res) {
res.sendFile(__dirname + '/chat2/app/index.html');
});


app.post('/signup',userAction.signup)
app.post('/login',userAction.login)
app.post('/:userName/sendRequest',userAction.sendRequest)
app.post('/:userName/acceptrequest',userAction.acceptrequest)
app.post('/getInfo',userAction.getInfo)
app.post('/savemsgdetails',userAction.savemsgdetails)

var usernames = {};
var rooms = [];
var room;

io.sockets.on('connection', function (socket,client) {
    
    socket.on('adduser', function (data) {
        console.log(data)
      
        var username = data.username;
        // var username2=data.chatwith;
         room = data.room;

    
        if (rooms.indexOf(room) != -1) {
            socket.username = username;
            //socket.username2 = username2;
          //  console.log(socket.username2)
            console.log(socket.username)
            socket.room = room;
            console.log(socket.room)
            usernames[username] = username;
            console.log(usernames)
            socket.join(room);
            //console.log(socket.join(room))
           console.log(io.engine.clientsCount)
           console.log(socket.id)
          //  var clients = io.sockets.clients();
            //console.log(clients)
            socket.emit('updatechat', 'SERVER', 'You are connected. Start chatting');
            socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');
        } else {
            socket.emit('updatechat', 'SERVER', 'Please enter valid code.');
        }
    });
    
    socket.on('createroom', function (data) {
        console.log(data.chatwith)
//         console.log(user1)
// console.log(user2)

       // var new_room = ("" + Math.random()).substring(2, 7);
       // rooms.push(new_room);
       // data.room = new_room;
       // console.log(socket.id);'
        rooms.push(data.room)
       bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(data.room, salt, function(err, hash) {
       console.log(hash+"req--->>  "+data.room);
      
       console.log(rooms)
      // room=data.combined;
       
      // console.log(room)
       
        socket.emit('updatechat', data.username, 'Your room is ready, invite someone using this ID:' + data.room);
        socket.emit('roomcreated', data);
       //  socket.emit('connectFriend',data);
   
   }) 
})
    });

    socket.on('sendchat', function (data) {
        io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    });

    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        if (socket.username !== undefined) {
            socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
            socket.leave(socket.room);
        }
    });
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-  With, Content-Type, Accept");
    next();   
});

app.all('/posts', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

app.get('/', function (req, res) { 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(contents);
})