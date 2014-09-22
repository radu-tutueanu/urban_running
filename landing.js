/*var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(filepath)).listen();*/

var path = require( 'path' );
var express = require('express');   
var bodyParser = require('body-parser');

thankyoupage = '/thankyou.html';
landingdir = '/landing';
port = process.argv[ 2 ];
filepath = path.join( __dirname + landingdir );
app = express();

app.use(express.static(filepath ));
app.use(bodyParser());

app.post('/', function (req, res) {
   console.log(  req.body['your-email'] );
   res.sendfile(path.join(filepath+ thankyoupage ));
});
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});