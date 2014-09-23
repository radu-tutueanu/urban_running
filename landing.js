/*var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(filepath)).listen();*/

var path = require( 'path' );
var express = require('express');   
var bodyParser = require('body-parser');
var mongoose = require( 'mongoose' );

var dbURI = process.env.MONGOLAB_URI ||
	'mongodb://localhost/undealergam';
dbURI = dbURI + "?keepAlive=1"
var thankyoupage = '/thankyou.html';
var landingdir = '/landing';
var port = process.argv[ 2 ];
var filepath = path.join( __dirname + landingdir );
var app = express();

app.use(express.static(filepath ));
app.use(bodyParser());

/* Create the database connection */
mongoose.connect( dbURI );

var db = mongoose.connection;

/*** CONNECTION EVENTS ***/
/* When successfully connected */
mongoose.connection.on( 'connected', function() {
	console.log( 'Mongoose connection open to ' + dbURI );
} );

/* If the connection throws an error */
mongoose.connection.on( 'error', function( err ) {
	console.log( 'Mongoose connection error: ' + err );
} );

/* When the connection is disconnected */
mongoose.connection.on( 'disconnected', function() {
	console.log( 'Mongoose connection disconnected' );
} );

/* If the Node process ends, close the Mongoose connection */
process.on( 'SIGINT', function() {
	mongoose.connection.close( function() {
		console.log( 'Mongoose connection disconnected through app termination' );
		process.exit( 0 );
	} );
} );

/* Defining schemas */

var Schema = mongoose.Schema;

var emailSchema = new Schema( {
	emailAddr: String
} );

emailSchema.statics.findAll = function( callback ) {
	this.find().exec( callback );
}

var emailModel = mongoose.model( 'Email', emailSchema );

/*** APP EVENTS ***/

app.post('/', function (req, res) {
	if ( req.body['your-email'] == 'parola31709@secret.undealergam' ) {
		emailModel.findAll( function( err, emails ) {
			if ( err ) return console.error( err );
			res.send( emails );
		})
		return;
	}

	var emailEntry = new emailModel( { emailAddr: req.body['your-email'] } );
	emailEntry.save( saveObjectCallback );
	res.sendfile(path.join( filepath + thankyoupage ));
});

var server = app.listen(port, function() {
	console.log('Listening on port %d', server.address().port);
});

/* Functions used internally */
function saveObjectCallback( err, object ) {
	if ( err )
		console.error( err );
}