var connected = false;
var outerws = null;
var clientName = "John Doe";
var clientID = null;

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8124});
wss.on('connection', function(ws) {
	console.log('client connected');
	connected = true;
	outerws = ws;
    ws.on('message', parseMessage);

    ws.on('data', function(chunk) {
  console.log('got %d bytes of data %s', chunk.length, chunk);
	});

	ws.on('end', function() {
    console.log('client disconnected');
  });
    
});



function parseMessage( message ){
	atoms = message.split(";");
	if( atoms[0] == "login" ){
		if( verifyPass( atoms[1], atoms[2] ) ){
			clientName = atoms[1];
			sendOK();
		}
			
		else sendNOK();
		return;
	}
	if (atoms[0] == "sentRoute") {
		console.log( '%s: receiving route', clientName );
		return;
	}
	if (atoms[0] == "getRoutes") {
		console.log( '%s: sending route', clientName );
		return;
	}
	console.error("%s :first atom not supported %s", clientName, atoms[0] );
}

function verifyPass(username, password){
	console.log( 'verifying pass for client %s', username );
	return true;
}

function sendOK(){
	sendMessage( "login:OK" );
}

function sendNOK(){
	sendMessage( "login:NOK" );
}

function sendMessage( message ){
	console.log( '%s: sending message %s', clientName, message );
	outerws.send( message );
}