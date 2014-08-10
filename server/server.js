var http = require( 'http' );
var url = require( 'url' );
var fs = require( 'fs' );
var path = require( 'path' );
var common = require( './common' )
var server;
var routes = [];
var htmlDir = '/html'
var db = require( './mongodb' );
/* regular expressions for detecting /css/ and /js/ folders.  */
var cssRE = /[//]css[//]/g;
var jsRE = /[//]js[//]/g;
var imgRE = /[//]img[//]/g;

server = http.createServer( function( req, res ) {
        // your normal server code
        var respath = url.parse( req.url ).pathname;
        filepath = path.join( __dirname + htmlDir );
        filepath = path.join( filepath, respath );
        
        if ( jsRE.exec( respath ) != null ) {

            fs.readFile( filepath, function( err, data ) {
                    if ( err ) {
                        return send404( res );
                    }
                    res.writeHead( 200, {
                        'Content-Type': 'application/javascript'
                    } );
                    res.write( data, 'utf8' );
                res.end();
            } );
            return;
        }

        if ( cssRE.exec( respath ) != null ) {

            fs.readFile( filepath, function( err, data ) {
                    if ( err ) {
                        return send404( res );
                    }
                    res.writeHead( 200, {
                        'Content-Type': 'text/css'
                    } );
                    res.write( data, 'utf8' );
                res.end();
            } );
            return;
        }

        if ( imgRE.exec( respath ) != null ) {

            fs.readFile( filepath, function( err, data ) {
                    if ( err ) {
                        return send404( res );
                    }
                    res.writeHead( 200, {
                        'Content-Type': 'image/gif'
                    } );
                    res.write( data, 'utf8' );
                res.end();
            } );
            return;
        }

        switch ( respath ) {
            case '/':
                res.writeHead( 200, {
                    'Content-Type': 'text/html',
                    "Access-Control-Allow-Origin": "*"
                } );
                res.write( '<h1>Hello! Try the <a href="index.html">Main page</a></h1>' );
                res.end();
                break;
            case '/index.html':
                fs.readFile( filepath, function( err, data ) {
                        if ( err ) {
                            return send404( res );
                        }
                        res.writeHead( 200, {
                            'Content-Type': respath == 'json.js' ? 'text/javascript' : 'text/html'
                        } );
                        res.write( data, 'utf8' );
                res.end();
            } );
            break;
        default:
            fs.readFile( filepath, function( err, data ) {
                if ( err ) {
                    return send404( res );
                }
                res.writeHead( 200, {
                    'Content-Type': respath == 'json.js' ? 'text/javascript' : 'text/html'
                } );
                res.write( data, 'utf8' );
                res.end();
            } );
    }
} ),

send404 = function( res ) {
    res.writeHead( 404 );
    res.write( '404' );
    res.end();
};

server.listen( 8001 );

// use socket.io
var io = require( 'socket.io' ).listen( server );

//turn off debug
io.set( 'log level', 1 );

// define interactions with client
io.sockets.on( 'connection', function( socket ) {

        //socket.emit( common.SEND_ALL_ROUTES, createAllRoutesJson() );
        db.getTrasee( socket );

        //login
        socket.on( common.LOGIN, function( data ) {
            if ( verifyPass( data.username, data.password ) ) {
                socket.emit( common.LOGINOK );
            } else {
                socket.emit( common.LOGINNOK );
            }
        } );
        //receiveRoute
    socket.on( common.SEND_ROUTE, function( data ) {
        console.log( "received route\n" );
        receiveRoute( data );
    } );
    //routesRequest
    socket.on( common.REQUEST_ALL_ROUTES, function( data ) {
        console.log( "received routes request\n" );
        db.getTrasee( socket );
    } );
    //routeINFORequest
    socket.on( common.REQUEST_ROUTE_INFO, function( data ) {
        console.log( "received  route info request\n" );
        db.getInfoTraseu( data.id, socket );
    } );
} );



function verifyPass( username, password ) {
    console.log( 'verifying pass for client %s', username );
    return false;
}


function receiveRoute( route ) {
    for ( key in route ) {
        db.insertTraseu( key, route[ key ] );
        break;
    }
    /*db.insertTraseu(route['username'], route['name'], route['distance'], route['whenField'],
        route['whereField'], route['trafficField'], route['dogsField'], route['lightsField'],
        route['safetyField'], route['observationsField'], route['coordinates']);
    routes.push(route);*/
}

function createAllRoutesJson() {
    allRoutes = {}
    for ( var i = routes.length - 1; i >= 0; i-- ) {
        allRoutes[ routes[ i ][ 'name' ] ] = routes[ i ][ 'coordinates' ];
    };
    return allRoutes;
}



/*


//send data to client
    setInterval(function(){
        socket.emit('date', {'date': new Date()});
    }, 1000);*/