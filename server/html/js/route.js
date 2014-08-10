function Route() {
	this.routeJSON = {};
	this.latLngCoordinates = [];
}

Route.prototype.getJSON = function() {
	return RouteJSON;
}

Route.prototype.addLatLngCoordinate = function( coordLatLng ) {
	this.latLngCoordinates.push( coordLatLng );
}

Route.prototype.getLatLngCoordinates = function( coordLatLng ) {
	return this.latLngCoordinates;
}