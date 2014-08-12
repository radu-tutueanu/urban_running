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

	var len_circ = document.ContactForm.circ.length;
	var len_caini = document.ContactForm.caini.length;
	var len_lum = document.ContactForm.caini.length;
	var ales_circ = "";
	var ales_caini = "";
	var ales_lum = "";
	var den_box = document.ContactForm.denumire.value;
	var cand_box = document.ContactForm.cand.value;
	var unde_box = document.ContactForm.unde.value;
	var sig_box = document.ContactForm.sig.value;
	var obs_box = document.ContactForm.nume_obs.value;
	var i;

	//validare pentru întrebarea cu circulație
	for ( i = 0; i < len_circ; i++ ) {
		if ( document.ContactForm.circ[ i ].checked ) {
			ales_circ = document.ContactForm.circ[ i ].value;

		}
	}

	//validarea pentru întrebarea cu câini
	for ( i = 0; i < len_caini; i++ ) {
		if ( document.ContactForm.caini[ i ].checked ) {
			ales_caini = document.ContactForm.caini[ i ].value;

		}
	}

	//validare pentru întrebarea cu lumini
	for ( i = 0; i < len_lum; i++ ) {
		if ( document.ContactForm.lum[ i ].checked ) {
			ales_lum = document.ContactForm.lum[ i ].value;
		}
	}


	if ( ales_circ == "" || ales_caini == "" || ales_lum == "" || cand_box.length < 1 || unde_box.length < 1 || sig_box.length < 1 || den_box.length < 1 ) {
		document.getElementById( "eroare_rasp" ).innerHTML = "Te rugăm să completezi toate răspunsurile obligatorii."
	}

	//dacă toate răspunsurile sunt bifate elimin mesajul
	if ( ales_circ != "" && ales_caini != "" && ales_lum != "" && cand_box.length > 1 && unde_box.length > 1 && sig_box.length > 1 && den_box.length > 1 ) {
		document.getElementById( "eroare_rasp" ).innerHTML = "";
		self.gmapsUtilities.addToRoute( den_box, ales_circ, ales_caini, ales_lum, cand_box, unde_box, sig_box, obs_box );
		self.gmapsUtilities.sendRoute();
		alert( 'Traseul salvat! Apăsați pe OK pentru a fi redirectionat către pagina principală.' );
		window.open( "/index.html", "_self" );
	}


}