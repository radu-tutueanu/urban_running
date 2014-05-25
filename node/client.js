function parseMessage( message ){
	atoms = message.split(";");
	if( atoms[0] == "login" ){
		if( atoms[1] == "OK" )
			loggedIn = true;
		else 
			console.log( '%s: bad login', clientName );
	}

	if (atoms[0] == "sentRoute") {
		console.log( '%s: receiving route', clientName );
		return;
	}

	console.error("%s :first atom not supported %s", clientName, atoms[0] );
}

function alertBadLogin(){
	console.log( '%s: bad login', clientName );
}





var connection = new WebSocket('ws://127.0.0.1:8124');
clientName = JohnDoe;
var loggedIn = false;

connection.onopen = function () {
  connection.send('getRoutes;'); // Send the message 'Ping' to the server
};
connection.onmessage = parseMessage;

