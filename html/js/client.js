__COLORS = [ '#FAEBD7', '#7FFFD4', '#0000FF', '#8A2BE2', '#A52A2A', '#5F9EA0', '#D2691E', '#FF7F50', '#6495ED', '#DC143C', '#00008B', '#008B8B', '#B8860B',
	'#006400', '#8B008B', '#556B2F', '#8B0000', '#E9967A', '#483D8B', '#2F4F4F', '#00CED1', '#9400D3', '#1E90FF']
var cookieName = "wheretorun";
var cookieValue = "street";
var nDays = 30; //number of days after which the cookie will expire and the user will see the pop-up window again;

function ClientUtilities( gmapsUtilities ) {
	self.gmapsUtilities = gmapsUtilities;
	self.drawnRoutes = new Array();
}

ClientUtilities.prototype.processReceivedRoutes = function( receivedRoutes ) {
	console.log( 'procssing Routes' );
	for ( i = 0; i <= receivedRoutes.length - 1; i++ ) {
		this.procesSingleRoute( receivedRoutes[ i ], true );
	}
}

ClientUtilities.prototype.procesSingleRoute = function( route, drawMarker ) {
	path = google.maps.geometry.encoding.decodePath( route[ 'encodedPolyline' ] );
	this.drawRoute( path );
	if ( drawMarker )
		self.gmapsUtilities.addRouteMarker( path[ 0 ], route );
	else {
		self.gmapsUtilities.addViewRouteMarker( path );
		self.gmapsUtilities.setCenter( path[ 0 ] );
	}
	
}

ClientUtilities.prototype.arrayToLatLng = function( array ) {
	var latlngArray = new Array();
	for ( i = 0; i < array.length; i += 2 ) {
		latlngArray.push( new google.maps.LatLng( array[ i ], array[ i + 1 ] ) );
	}
	return latlngArray;
}

ClientUtilities.prototype.drawRoute = function( latLngPath ) {
	color = __COLORS[ ( Math.round( Math.random() * __COLORS.length ) ) ]
	var path = new google.maps.Polyline( {
		path: latLngPath,
		geodesic: true,
		strokeColor: color,
		strokeOpacity: 0.6,
		strokeWeight: 6
	} );
	self.drawnRoutes.push( path );
	path.setMap( self.gmapsUtilities.getmap() );

}


ClientUtilities.openColorBox = function() {
	var date, expires;
	var days = 7;//the numer of days after which the cookie expires;
	var cook = document.cookie;
	var index = cook.indexOf("wheretorun");
	if (index == -1) { //does not find string, cookie does not exist
	$.colorbox( {
		iframe: true,
		width: "55%",
		height: "35%",
		href: "/pop-up.html"
	} );
	date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	expires = "expires=" + date.toGMTString();
	document.cookie = "runcookie=wheretorun;" + expires;//set cookie
} 
	/*else {
	
	}*/
}

/*"expires=Wed, 01 Oct 2014 02:29:15 GMT" client.js:68
"expcookie=expires=Wed, 01 Oct 2014 02:29:15 GMT"
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
*/
ClientUtilities.prototype.validateAndSave = function() {
//funcție ce validează câmpurile din formular
	
	var ales_circ = document.getElementById("range_circ").innerHTML;
	var ales_caini = document.getElementById("range_caini").innerHTML;
	var ales_lum = document.getElementById("range_lum").innerHTML;//pe astea 3 nu le mai validăm
	var den_box = document.ContactForm.textden.value;
	var cand_box = document.ContactForm.textcand.value;
	var unde_box = document.ContactForm.textunde.value;
	var sig_box = document.ContactForm.textsig.value;
	var obs_box = document.ContactForm.textobs.value;
	var i;



	if (cand_box.length < 1 || unde_box.length < 1 || sig_box.length < 1 || den_box.length < 1 ) {
		document.getElementById( "eroare_rasp" ).innerHTML = "Te rugăm să completezi toate răspunsurile obligatorii."
	//	alert("completeaza rasp");
	}
	else if (!self.gmapsUtilities.isRouteDrawn ()) {
		document.getElementById( "eroare_rasp" ).innerHTML = "Te rugăm să desenezi traseul.";
	//	alert("pe ramura de else if - not isRouteDrawn");
	}

	else {
	//dacă toate răspunsurile sunt bifate elimin mesajul
		document.getElementById( "eroare_rasp" ).innerHTML = "";
		self.gmapsUtilities.addToRoute( den_box, ales_circ, ales_caini, ales_lum, cand_box, unde_box, sig_box, obs_box );
		self.gmapsUtilities.sendRoute();
	
		alert( 'Traseu salvat! Apăsați pe OK pentru a fi redirectionat către pagina principală.' );
		window.open( "/index.html", "_self" ); 
	}
	
}

ClientUtilities.prototype.parseURLParams = function(url) {
  var queryStart = url.indexOf("?") + 1,
    queryEnd = url.indexOf("#") + 1 || url.length + 1,
    query = url.slice(queryStart, queryEnd - 1),
    pairs = query.replace(/\+/g, " ").split("&"),
    parms = {},
    i, n, v, nv;

  if (query === url || query === "") {
    return;
  }

  for (i = 0; i < pairs.length; i++) {
    nv = pairs[i].split("=");
    n = decodeURIComponent(nv[0]);
    v = decodeURIComponent(nv[1]);

    if (!parms.hasOwnProperty(n)) {
      parms[n] = [];
    }

    parms[n].push(nv.length === 2 ? v : null);
  }
  return parms;
}

ClientUtilities.prototype.showValue = function(newValue,id_range){
//apelată când se schimbă valoarea din întrebările 4, 5, 6
document.getElementById(id_range).innerHTML=newValue;
}

ClientUtilities.prototype.closeInfo = function() {
	document.getElementById("info_id").style.visibility="hidden";
	document.getElementById("fundal_info_id").style.visibility="hidden";
	document.getElementById("dublura").style.visibility="hidden";
	//alert("am ajuns");
	document.getElementById("close").style.visibility="hidden";
	//alert("am ajuns iar!");
}

ClientUtilities.initLogging = function( isEnabled, enablePopUp ) {
	log = log4javascript.getLogger();
	if( isEnabled ) { 
		/*Set the logger level. Useful if you want to debug something
		ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL, OFF*/
		log.setLevel( log4javascript.Level.ALL )

		if( enablePopUp ){
			var popUpAppender = new log4javascript.PopUpAppender();
			// Change the desired configuration options
			popUpAppender.setFocusPopUp( true );
			popUpAppender.setNewestMessageAtTop( true );
			
			// Add the appender to the logger
			log.addAppender( popUpAppender );
		}	
		log.debug( "Logging enabled" );
	}
	else {
		log.setLevel( log4javascript.Level.OFF );
	}
}