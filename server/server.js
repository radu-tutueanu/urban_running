var http = require('http');
var url = require('url');
var fs = require('fs');
var common = require('./common')
var server;
var htmlDir = '/html/'

server = http.createServer(function(req, res){
    // your normal server code
    var path = url.parse(req.url).pathname;
    switch (path){
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<h1>Hello! Try the <a href="index.html">Main page</a></h1>');
            res.end();
            break;
        case '/index.html':
            fs.readFile(__dirname + htmlDir+ path, function(err, data){
                if (err){
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
        break;
        case '/adauga_traseu.css':
            fs.readFile(__dirname + htmlDir+ path, function(err, data){
                if (err){
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type':  'text/css' });
                res.write(data, 'utf8');
                res.end();
            });
            break;
        default: 
            fs.readFile(__dirname + htmlDir+ path, function(err, data){
                if (err){
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
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
    
   socket.emit(common.SEND_ALL_ROUTES, {' narcis' : [44.4136738372583, 26.102828979492188, 44.4136738372583, 26.102828979492188, 
            44.41408911082398, 26.10262580215931, 44.41425818906652, 26.10299527645111],
            'radu' : [ 44.4217124730134, 26.064776480197906, 44.42180059302007, 26.06495887041092, 44.42080444607848, 26.0658198595047]}); //Testing purposes; this should be taken out of the DB
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
    socket.on(common.SEND_ROUTE, function(data){
         process.stdout.write("received route\n");
          process.stdout.write(data[0]+'');
    });
    //routesRequest
     socket.on(common.REQUEST_ALL_ROUTES, function(data){
          process.stdout.write("received routes request\n");
           socket.emit(common.SEND_ALL_ROUTES, {' narcis' : [44.4136738372583, 26.102828979492188, 44.4136738372583, 26.102828979492188, 
            44.41408911082398, 26.10262580215931, 44.41425818906652, 26.10299527645111],
            'radu' : [ 44.4217124730134, 26.064776480197906, 44.42180059302007, 26.06495887041092, 44.42080444607848, 26.0658198595047]}); //Testing purposes; this should be taken out of the DB
    });
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