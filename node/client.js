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

function setPath( markers ){
	stringToBeSent= "sentRoute;";

	function addToString(value, index, array){
	//	stringToBeSent = stringToBeSent + value.lat() + ";"; //code on real client
	//	stringToBeSent = stringToBeSent + value.lng() + ";";
		stringToBeSent = stringToBeSent + value + ";"; //test code
		
	}

	markers.forEach( addToString );

	return stringToBeSent;
}




var connection = new WebSocket('ws://127.0.0.1:8124');
clientName = 'JohnDoe';
var loggedIn = false;

connection.onopen = function () {
  connection.send('getRoutes;'); 
  testMarkers = new Array();
testMarkers.push(44.39687266303073,26.113386154174805);
testMarkers.push(44.39727895272829,26.109824180603027);
testMarkers.push(44.39374490449711,6.109845638275146);
testString = setPath( testMarkers ) ;
console.log(testString);
connection.send( testString );
};
connection.onmessage = parseMessage;


/*
* Test for send markers
*/

testMarkers = new Array();
testMarkers.push(44.39687266303073,26.113386154174805);
testMarkers.push(44.39727895272829,26.109824180603027);
testMarkers.push(44.39374490449711,6.109845638275146);
connection.send(setPath( testMarkers ));
