function Route() {
	this.routeJSON = {};
	this.latLngCoordinates = [];
}

Route.prototype.getJSON = function() {
	return RouteJSON;
};

Route.prototype.addLatLngCoordinate( coordLatLng ) {
	this.latLngCoordinates.push( coordLatLng );
}

Route.prototype.getLatLngCoordinates( coordLatLng ) {
	return this.latLngCoordinates;
}