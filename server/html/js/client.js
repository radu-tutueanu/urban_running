function ClientUtilities( gmapsUtilities ) {
  self.gmapsUtilities = gmapsUtilities;
  self.drawnRoutes = new Array();
}

ClientUtilities.prototype.processReceivedRoutes = function( receivedRoutes ) {
  console.log( 'procssing Routes' );
  for ( i = 0; i <= receivedRoutes.length - 1; i++ ) {
    currentRoute = receivedRoutes[ i ];
    latlngArray = this.arrayToLatLng( currentRoute[ 'coordinates' ] );
    this.drawRoute( latlngArray );
    self.gmapsUtilities.addRouteMarker( currentRoute );
  }
}

ClientUtilities.prototype.arrayToLatLng = function( array ) {
  var latlngArray = new Array();
  for ( i = 0; i < array.length; i += 2 ) {
    latlngArray.push( new google.maps.LatLng( array[ i ], array[ i + 1 ] ) );
  }
  return latlngArray;
}

ClientUtilities.prototype.drawRoute = function( coordinates ) {
  var path = new google.maps.Polyline( {
    path: coordinates,
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
