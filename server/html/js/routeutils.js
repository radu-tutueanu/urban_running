function transformPath(markers) {
  var coordinates = Array();

  function addValuesToVector(value, index, array) {
    coordinates.push(value.lat());
    coordinates.push(value.lng());

  }


  markers.forEach(addValuesToVector);

  return coordinates;
}



function calcDistance(route) {
  var total = 0;
  for (var i = 0; i < route.legs.length; i++) {
    total = total + route.legs[i].distance.value;
  }
  return total;
}

function calcDuration(route) {
  var total = 0;
  for (var i = 0; i < route.legs.length; i++) {
    total = total + route.legs[i].duration.value;
  }
  return total;
}

function calcRoute(traseu) {
  var markers_length = traseu.markers.length;
  if (markers_length < 2) {
    return;
  }
  if (markers_length != 2) {
    addLastWaypoint(traseu);
  }
  createAndSendRequest(traseu, handleDirectionsResponseWithPrint);
}

function addLastWaypoint(traseu) {
  var waypoint = new Object();
  waypoint.location = traseu.markers[traseu.markers.length - 2];
  waypoint.stopover = false;
  traseu.waypoints.push(waypoint);
}

function createAndSendRequest(traseu, callback) {
  start = traseu.markers[0];
  end = traseu.markers[traseu.markers.length - 1];
  var request = {
    origin: start,
    destination: end,
    waypoints: traseu.waypoints,
    travelMode: google.maps.TravelMode.WALKING
  };

  directionsService.route(request, callback);
}

function drawPolyFromDirectionsResponse(response, status) {
  if (status != google.maps.DirectionsStatus.OK) {
    //Here we'll handle the errors a bit better 
    alert('Directions failed: ' + status);
  } else {
    drawRoute(response.routes[0].overview_path);
  }
}

function resetRoute(map) {
  initializeCurrent();
  directionsDisplay.setMap();
  initializeDirectionsDisplay(map);

}

function initializeCurrent() { //TODO delete current route
  current = new Object();
  current.markers = new Array();
  current.waypoints = new Array();
}

function drawRoute(coordinates) {
  var path = new google.maps.Polyline({
    path: coordinates,
    //geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  drawn.push(path);
  path.setMap(map);

}

function calcRouteFromScratch(traseu) {
  if (traseu.markers.length < 2) {
    alert('Received bad markers from server');
    return;
  }

  for (i = 1; i < traseu.markers.length - 1; i++) {
    var waypoint = new Object();
    waypoint.location = traseu.markers[i];
    waypoint.stopover = false;
    traseu.waypoints.push(waypoint);
  }
  console.log('drawing');
  createAndSendRequest(traseu, drawPolyFromDirectionsResponse);

}

function processReceivedRoutes(receivedRoutes) {
  console.log('procssing Routes');
  for (i = 0; i <= receivedRoutes.length - 1; i++) {
    console.log(receivedRoutes[i]['name']);
    id = receivedRoutes[i]['_id'];
    name = receivedRoutes[i]['name'];
    coordinates = receivedRoutes[i]['coordinates'];
    /* TODO fix whatever is happpening here, distroying received routes from being processed*/
    traseu = vectorToTraseu(coordinates);
    traseu.id = id;
    traseu.name = name;
    console.log(receivedRoutes[i]);
    calcRouteFromScratch(traseu);
    createMarker(traseu, "/pagina_traseu.html?id=" + traseu.id);
  }

}



function vectorToTraseu(array) {
  var traseu = new Object();
  traseu.markers = new Array();
  traseu.waypoints = new Array();
  for (i = 0; i < array.length; i += 2) {
    traseu.markers.push(new google.maps.LatLng(array[i], array[i + 1]));
  }

  return traseu;
}

function placeMarker(position, map) {
  current.markers.push(position);
  calcRoute(current);
}


function processReceivedRoutesVariant(receivedRoutesDict) {
  for (var key in receivedRoutesDict) {
    console.log(key);
    coord = vectorToCoordinates(receivedRoutesDict[key]);
    drawRoute(coord); //TODO DRAW THEM DIFFERENTLY
  }

}

function vectorToCoordinates(array) {
  var coordinates = Array()
  for (i = 0; i < array.length; i += 2) {
    coordinates.push(new google.maps.LatLng(array[i], array[i + 1]));
  }

  return coordinates;
}