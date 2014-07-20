function initialize() {

  var mapOptions = {
    zoom: 11,
    center: new google.maps.LatLng(44.4325, 26.1039)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);
  initializeDirectionsDisplay(map);
}

function initializeDirectionsDisplay(map, preserveViewport) {
  if (typeof(preserveViewport) === 'undefined') preserveViewport = true;
  var options = new Object();
  options.draggable = true;
  options.preserveViewport = preserveViewport;
  directionsDisplay = new google.maps.DirectionsRenderer(options);
  directionsDisplay.setMap(map);
}

function initializeWithMarkersListener() {
  initialize();


  google.maps.event.addListener(map, 'click', function(e) {
    placeMarker(e.latLng, map);

  });

}

function initializeWithoutVieportPreservation() {
  var mapOptions = {
    zoom: 11,
    center: new google.maps.LatLng(44.4325, 26.1039)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);
  initializeDirectionsDisplay(map, false);
}

function handleDirectionsResponse(response, status) {
  if (status != google.maps.DirectionsStatus.OK) {
    //Here we'll handle the errors a bit better 
    alert('Directions failed: ' + status);
    if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
      initializeCurrent();
    }
    return -1;
  } else {
    directionsDisplay.setDirections(response);
  }
  return 1;


}


function handleDirectionsResponseWithPrint(response, status) {
  if (handleDirectionsResponse(response, status) == 1) {
    // Display the distance:
    current.distance = calcDistance(response.routes[0]);
    document.getElementById('distance').innerHTML += current.distance + " meters";

    // Display the duration:
    document.getElementById('duration').innerHTML +=
      calcDuration(response.routes[0]) + " seconds";
  }

}

function createMarker(traseu, url) {

  var marker = new google.maps.Marker({
    position: traseu.markers[0]
  });
  marker.setMap(map);
  console.log(traseu.id);
  console.log(url);
  google.maps.event.addListener(marker, 'click', function() {
    window.open(url, "_self")
  });
  marker.infowindow = new google.maps.InfoWindow({
    content: traseu.name
  });

  google.maps.event.addListener(marker, 'mouseover', function(event) {
    marker.infowindow.open(map, marker);
  }); //route name appears when mouse is over the marker

  google.maps.event.addListener(marker, 'mouseout', function(event) {
    marker.infowindow.close();
  });
}