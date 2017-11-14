var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 3000;
server.listen(port, function(){
	console.log('Server listen on port ' + port);
});

app.get('/', function(req, res){
	res.render('index');
});
var nameArr = [];
io.on('connection', function(socket){
	console.log('Socket ' + socket.id + ' connected...');

	socket.on('send-message', function(data){
		io.sockets.emit('new-message', {msg: data, un: socket.username});
	});	

	socket.on('send-name', function(data){
		if(nameArr.indexOf(data)>=0){
			socket.emit("new-name-fail", {name: data});
		}else{
			socket.username = data;
			nameArr.push(data);
			socket.emit("new-name-success", {name: data});
			io.sockets.emit('send-online-users', nameArr);
		}
		
	});	

	socket.on('typing-msg', function(data){
		var s = socket.username + " đang nhập văn bản";
		io.sockets.emit('show-typing-msg', s);
	})

	socket.on('out-typing-msg', function(data){
		io.sockets.emit('not-typing');
	});

	socket.on('log-out', function(){
		nameArr.splice(nameArr.indexOf(socket.username), 1);
		socket.broadcast.emit('someone-out', socket.username);
	});	
});