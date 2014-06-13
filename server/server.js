var http = require('http');
var url = require('url');
var fs = require('fs');
var common = require('./common')
var server;

server = http.createServer(function(req, res){
    // your normal server code
    var path = url.parse(req.url).pathname;
    switch (path){
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<h1>Hello! Try the <a href="/index.html">Main page</a></h1>');
            res.end();
            break;
        case '/index.html':
            fs.readFile(__dirname + path, function(err, data){
                if (err){
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
        break;
        default: send404(res);
    }
}),

send404 = function(res){
    res.writeHead(404);
    res.write('404');
    res.end();
};

server.listen(8001);

// use socket.io
var io = require('socket.io').listen(server);

//turn off debug
io.set('log level', 1);

// define interactions with client
io.sockets.on('connection', function(socket){
    
    setInterval(function(){
        socket.emit('date', {'date': new Date()});
    }, 1000);
    //recieve client data
    socket.on('client_data', function(data){
        process.stdout.write(data.letter);
    });
    //login
    socket.on(common.LOGIN, function(data){
        if ( verifyPass (data.username, data.password )) {
            socket.emit(common.LOGINOK);
        }
        else{
            socket.emit(common.LOGINNOK);
        }
    });
    //receiveRoute

    //routesRequest
});




function verifyPass(username, password){
    console.log( 'verifying pass for client %s', username );
    return false;
}


function receiveRoute ( atoms ) {
    coordArray = Array();
    for (var index in atoms){
        console.log( atoms[index] );
        coordArray.push( atoms[index] );
    }
    return coordArray;
}



/*


//send data to client
    setInterval(function(){
        socket.emit('date', {'date': new Date()});
    }, 1000);*/