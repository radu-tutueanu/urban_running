var mapsUtilities;

function MapsUtilities(zoom, centerLat, centerLng, viewportPreservation, markerListerner, serverSocket, drawingCursor, searchBox) {
	this.mapOptions = {
		zoom: zoom,
		center: new google.maps.LatLng(centerLat, centerLng)
	};
	console.log(drawingCursor)
	if (drawingCursor) {
		this.mapOptions["draggableCursor"] = "url(" + MapsUtilities.cursorUrl + "), auto";
	}
	this.viewportPreservation = viewportPreservation;
	this.markerListerner = markerListerner;
	this.directionsService = new google.maps.DirectionsService();
	this.current = new Route();
	mapsUtilities = this;
	this.serverSocket = serverSocket;
	this.routesHeadMarkers = new Array();
	this.searchMarkers = [];
	this.searchBoxInit = searchBox;
}

MapsUtilities.mapsPageUrl = "/pagina_traseu.html?id=";
MapsUtilities.sendHeader = "send_route";
MapsUtilities.cursorUrl = "https://cdn1.iconfinder.com/data/icons/3d-printing-icon-set/64/Edit.png";


MapsUtilities.prototype.initialize = function() {
	this.map = new google.maps.Map(document.getElementById('map-canvas'),
		this.mapOptions);
	this.initializeDirectionsDisplay();
	mapsutil = this;
	if (this.markerListerner) {
		google.maps.event.addListener(this.map, 'click', function(e) {
			mapsutil.placeMarker(e.latLng);
		});
	}
	if( this.searchBoxInit) {
		this.initializeSearchBox();
	}
}

MapsUtilities.prototype.initializeDirectionsDisplay = function() {
	var options = new Object();
	options.draggable = true;
	options.preserveViewport = this.viewportPreservation;
	this.directionsDisplay = new google.maps.DirectionsRenderer(options);
	this.directionsDisplay.setMap(this.map);
}

MapsUtilities.prototype.initializeSearchBox = function() {
	console.log("search init")
	var markers = [];
	this.input = /** @type {HTMLInputElement} */ (
		document.getElementById('pac-input'));
	this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.input);
	searchBox = new google.maps.places.SearchBox(
		/** @type {HTMLInputElement} */
		(this.input));

	// Listen for the event fired when the user selects an item from the
	// pick list. Retrieve the matching places for that item.
	google.maps.event.addListener(searchBox, 'places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}
		for (var i = 0, marker; marker = markers[i]; i++) {
			marker.setMap(null);
		}

		// For each place, get the icon, place name, and location.
		markers = [];
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0, place; place = places[i]; i++) {
			var image = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			// Create a marker for each place.
			var marker = new google.maps.Marker({
				map: utilities.map,
				icon: image,
				title: place.name,
				position: place.geometry.location
			});

			markers.push(marker);

			bounds.extend(place.geometry.location);
		}

		utilities.map.fitBounds(bounds);
	});

	// Bias the SearchBox results towards places that are within the bounds of the
	// current map's viewport.
	google.maps.event.addListener(utilities.map, 'bounds_changed', function() {
		var bounds = utilities.map.getBounds();
		searchBox.setBounds(bounds);
	});


}

MapsUtilities.prototype.addRouteMarker = function(position, route) {

	var marker = new google.maps.Marker({
		position: position
	});
	marker.setMap(this.map);
	google.maps.event.addListener(marker, 'click', function() {
		window.open(MapsUtilities.mapsPageUrl + route['_id'], "_self")
	});
	marker.infowindow = new google.maps.InfoWindow({
		content: route['name']
	});

	google.maps.event.addListener(marker, 'mouseover', function(event) {
		marker.infowindow.open(this.map, marker);
	}); //route name appears when mouse is over the marker

	google.maps.event.addListener(marker, 'mouseout', function(event) {
		marker.infowindow.close();
	});

	self.routesHeadMarkers.push(marker);
}

MapsUtilities.prototype.getmap = function() {
	return this.map;
}

MapsUtilities.prototype.placeMarker = function(position) {
	this.current.addMarker(position);
	request = this.current.getRequest();
	if (request == null)
		return;
	/*send request to calculate route based on all markers put by user*/
	this.directionsService.route(request, this.handleDirectionsResponseWithPrint);
}

MapsUtilities.prototype.isRouteDrawn = function() {

	if (this.current.getMarkersLen() > 1) {
		return true;
	}
	return false;

}

MapsUtilities.prototype.reset = function() {
	this.current.reset();
	this.directionsDisplay.setMap();
	this.initializeDirectionsDisplay(this.map);
}

MapsUtilities.prototype.handleDirectionsResponseWithPrint = function(response, status) {
	if (mapsUtilities.handleDirectionsResponse(response, status) == 1) {
		// Display the distance:
		distance = mapsUtilities.calcDistance(response.routes[0]);
		//	document.getElementById( 'distance' ).innerHTML += distance + " meters";

		// Display the duration:
		duration = mapsUtilities.calcDuration(response.routes[0]);
		//	document.getElementById( 'duration' ).innerHTML += duration + " seconds";
	}
}

MapsUtilities.prototype.handleDirectionsResponse = function(response, status) {
	if (status != google.maps.DirectionsStatus.OK) {
		//Here we'll handle the errors a bit better 
		alert('Directions failed: ' + status);
		if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
			this.reset(); //solve
		}
		return -1;
	} else {
		this.directionsDisplay.setDirections(response);
	}
	return 1;
}

MapsUtilities.prototype.addToRoute = function(name, traffic, dogs, lighting, when, where, safety, observations) {
	this.current.setName(name);
	this.current.setInfo(when, where, traffic, dogs, lighting, safety, observations);
}
MapsUtilities.prototype.sendRoute = function() {
	mapsRoute = this.directionsDisplay.getDirections()['routes'][0]
	this.current.setDistance(this.calcDistance(mapsRoute));
	this.current.setDuration(this.calcDuration(mapsRoute));
	this.current.setEncodePolyline(mapsRoute.overview_polyline);
	routeJson = {};
	routeJson['username'] = this.current.getJSON();
	this.serverSocket.emit(MapsUtilities.sendHeader, routeJson);
}

MapsUtilities.prototype.calcDistance = function(route) {
	var total = 0;
	for (var i = 0; i < route.legs.length; i++) {
		total = total + route.legs[i].distance.value;
	}
	return total;
}

MapsUtilities.prototype.calcDuration = function(route) {
	var total = 0;
	for (var i = 0; i < route.legs.length; i++) {
		total = total + route.legs[i].duration.value;
	}
	return total;
}