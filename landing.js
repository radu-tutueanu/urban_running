var connect = require('connect');
var serveStatic = require('serve-static');
var path = require( 'path' );

filepath = path.join( __dirname + '/landing' );
connect().use(serveStatic(filepath)).listen(process.argv[ 2 ]);