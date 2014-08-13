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
}

ClientUtilities.prototype.arrayToLatLng = function( array ) {
	var latlngArray = new Array();
	for ( i = 0; i < array.length; i += 2 ) {
		latlngArray.push( new google.maps.LatLng( array[ i ], array[ i + 1 ] ) );
	}
	return latlngArray;
}

ClientUtilities.prototype.drawRoute = function( latLngPath ) {
	var path = new google.maps.Polyline( {
		path: latLngPath,
		//geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 2
	} );
	self.drawnRoutes.push( path );
	path.setMap( self.gmapsUtilities.getmap() );

}

/* DOM/ HTML related functions*/

ClientUtilities.openColorBox = function() {
	$.colorbox( {
		iframe: true,
		width: "50%",
		height: "53%",
		href: "/pop-up.html"
	} );
}

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
	}

	//dacă toate răspunsurile sunt bifate elimin mesajul
	if (cand_box.length > 1 && unde_box.length > 1 && sig_box.length > 1 && den_box.length > 1 ) {
		document.getElementById( "eroare_rasp" ).innerHTML = "";
		
		if (self.gmapsUtilities.isRouteDrawn () ) {
		self.gmapsUtilities.addToRoute( den_box, ales_circ, ales_caini, ales_lum, cand_box, unde_box, sig_box, obs_box );
		self.gmapsUtilities.sendRoute();
	
		alert( 'Traseul salvat! Apăsați pe OK pentru a fi redirectionat către pagina principală.' );
		window.open( "/index.html", "_self" ); }
		else  {
			document.getElementById( "eroare_rasp" ).innerHTML = "Te rugăm să desenezi traseul.";
		}
	
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
	//alert("am ajuns");
	document.getElementById("close").style.visibility="hidden";
	//alert("am ajuns iar!");
}