var http = require('http');
var url = require('url');
var fs = require('fs');
var common = require('./common')
var server;
var routes = [];
var htmlDir = '/html/'
var db = require('./db');

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
        case '/index.css':
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

  socket.emit( common.SEND_ALL_ROUTES, createAllRoutesJson() );
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
     process.stdout.write( "received route\n" );
     receiveRoute( data );
 });
    //routesRequest
    socket.on(common.REQUEST_ALL_ROUTES, function(data){
        process.stdout.write("received routes request\n");
     /* socket.emit(common.SEND_ALL_ROUTES, {' narcis' : [44.4136738372583, 26.102828979492188, 44.4136738372583, 26.102828979492188, 
        44.41408911082398, 26.10262580215931, 44.41425818906652, 26.10299527645111],
            'radu' : [ 44.4217124730134, 26.064776480197906, 44.42180059302007, 26.06495887041092, 44.42080444607848, 26.0658198595047]}); //Testing purposes; this should be taken out of the DB*/
        socket.emit( common.SEND_ALL_ROUTES, createAllRoutesJson() );
  });
});




function verifyPass(username, password){
    console.log( 'verifying pass for client %s', username );
    return false;
}


function receiveRoute ( route ) {
    db.insertTraseu( route['username'], route['name'], route['distance'], route['whenField'], 
        route['whereField'], route['trafficField'], route['dogsField'], route['lightsField'],
        route['safetyField'], route['observationsField'], route['coordinates'] ) ;
    routes.push(route);
}

function createAllRoutesJson() {
    allRoutes = {}
    for (var i = routes.length - 1; i >= 0; i--) {
        allRoutes[ routes[i]['name'] ] = routes[i]['coordinates'] ;
    };
    return allRoutes;
}



/*


//send data to client
    setInterval(function(){
        socket.emit('date', {'date': new Date()});
    }, 1000);*/