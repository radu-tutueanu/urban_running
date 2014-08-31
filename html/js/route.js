function Route() {
	this.routeJSON = {};
	this.markers = new Array();
	this.waypoints = new Array();
	this.markerredostack = new Array();
	this.waypointredostack = new Array();
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
	this.markerredostack = new Array();
	this.waypointredostack = new Array();
}

Route.prototype.getMarkersLen = function() {
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

Route.prototype.getRequest = function( addWaypoint ) {
	var markers_length = this.markers.length;
	if ( markers_length < 2 ) {
		return null;
	}
	if ( markers_length != 2 && addWaypoint ) {
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

Route.prototype.hasUndo = function() {
	return this.markers.length > 0 ; 
}

Route.prototype.hasRedo = function() {
	return this.markerredostack.length > 0 ; 
}

Route.prototype.undo = function() {
	if ( !this.hasUndo() ) {
		log.debug( "nothing to undo");
		return false;
	}
	marker = this.markers.pop();
	this.markerredostack.push( marker );
	waypoint = this.waypoints.pop();
	this.waypointredostack.push( waypoint );
	return true;
}

Route.prototype.redo = function() {
	if ( !this.hasRedo() ) {
		log.debug( "nothing to redo" );
		return false;
	}
	marker = this.markerredostack.pop();
	this.markers.push( marker );
	waypoint = this.waypointredostack.pop();
	//this.waypoints.push( waypoint );
	return true;
}