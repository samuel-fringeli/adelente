var http = require('http');
var fs = require('fs');
var express = require('express');

var app = express();

var server = http.Server(app);

var io = require('socket.io').listen(server);

app.get('/', function(req, res) {
    fs.readFile('./index2.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

var possible_routes = ['/black/up', '/black/down', '/green/up', '/green/down', '/white/up', '/white/down', '/blue/up', '/blue/down'];

function declare_route(app, route, socket) {
	app.get(route, function(req, res) {
		socket.broadcast.emit('flicButtonEvent', route);
		res.end('socket sent');
	});	
}

io.sockets.on('connection', function (socket) {
    // console.log('Un client est connecté !');
    for (var i = 0; i < possible_routes.length; i++) {
    	declare_route(app, possible_routes[i], socket);
	}
});

console.log("serveur demarre sur localhost au port 8081")

server.listen(8081);
