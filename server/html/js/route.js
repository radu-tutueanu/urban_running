function Route() {
	this.routeJSON = {};
	this.markers = new Array();
	this.waypoints = new Array();
}

Route.prototype.reset = function() {
	this.markers = new Array();
	this.waypoints = new Array();
}

Route.prototype.getJSON = function() {
	return this.routeJSON;
}

Route.prototype.addMarker = function( marker ) {
	this.markers.push( marker );
}

Route.prototype.getMarkersLen = function() {
	alert(this.markers.length);
	return this.markers.length;
}

Route.prototype.getMarker = function( index ) {
	return this.markers[ index ];
}


Route.prototype.addLastWaypoint = function() {
	var waypoint = new Object();
	waypoint.location = this.markers[ this.markers.length - 2 ];
	waypoint.stopover = false;
	this.waypoints.push( waypoint );
}

Route.prototype.getRequest = function() {
	var markers_length = this.markers.length;
	if ( markers_length < 2 ) {
		return null;
	}
	if ( markers_length != 2 ) {
		this.addLastWaypoint();
	}
	start = this.markers[ 0 ];
	end = this.markers[ markers_length - 1 ];
	var request = {
		origin: start,
		destination: end,
		waypoints: this.waypoints,
		travelMode: google.maps.TravelMode.WALKING
	};
	return request;
}

Route.prototype.setEncodePolyline = function( encodedPolyline ) {
	this.routeJSON[ 'encodedPolyline' ] = encodedPolyline;
}

Route.prototype.setName = function( name ) {
	this.routeJSON[ 'name' ] = name;
}

Route.prototype.setInfo = function( when, where, traffic, dogs, lighting, safety, observations ) {
	info = {};
	info[ 'when' ] = when;
	info[ 'where' ] = where;
	info[ 'traffic' ] = traffic;
	info[ 'dogs' ] = dogs;
	info[ 'lighting' ] = lighting;
	info[ 'safety' ] = safety;
	info[ 'observations' ] = observations;
	this.routeJSON[ 'info' ] = info;
}

Route.prototype.setDistance = function( distance ) {
	this.routeJSON[ 'distance' ] = distance;
}

Route.prototype.setDuration = function( duration ) {
	this.routeJSON[ 'duration' ] = duration;
}