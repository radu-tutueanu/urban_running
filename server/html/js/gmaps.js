function MapsUtilities(zoom, centerLat, centerLng, viewportPreservation, markerListerner) {
	this.mapOptions = {
		zoom: zoom,
		center: new google.maps.LatLng(centerLat, centerLng)
	};
	this.viewportPreservation = viewportPreservation;
	this.initialize(viewportPreservation);
	if (markerListerner) {
		google.maps.event.addListener(this.map, 'click', function(e) {
			placeMarker(e.latLng, this.map);
		});

	}
}

MapsUtilities.prototype.initialize = function() {
	this.map = new google.maps.Map(document.getElementById('map-canvas'),
		this.mapOptions);
	initializeDirectionsDisplay();
}

MapsUtilities.prototype.initializeDirectionsDisplay = function() {
	var options = new Object();
	options.draggable = true;
	options.preserveViewport = this.viewportPreservation;
	this.directionsDisplay = new google.maps.DirectionsRenderer(options);
	this.directionsDisplay.setMap(this.map);
}

MapsUtilities.prototype.addRouteMarker = function(route, url) {

	var marker = new google.maps.Marker({
		position: route.markers[0]
	});
	marker.setMap(this.map);
	console.log(route.id);
	console.log(url);
	google.maps.event.addListener(marker, 'click', function() {
		window.open(url, "_self")
	});
	marker.infowindow = new google.maps.InfoWindow({
		content: route.name
	});

	google.maps.event.addListener(marker, 'mouseover', function(event) {
		marker.infowindow.open(this.map, marker);
	}); //route name appears when mouse is over the marker

	google.maps.event.addListener(marker, 'mouseout', function(event) {
		marker.infowindow.close();
	});
}