function openColorBox(){
        $.colorbox({iframe:true, width:"50%", height:"53%", href: "file:///C:/Users/Narcis/Desktop/simplu.html"});
		
      }
      
function openLogin() {
document.getElementById("fundal_id").style.visibility="visible";
document.getElementById("login").style.visibility="visible";
document.getElementById("user_id").style.visibility="visible";
document.getElementById("pass_id").style.visibility="visible";
document.getElementById("button_id").style.visibility="visible";

}

function validateLogin() {
var len_user=document.loginForm.nume_util.value;
var len_pass=document.loginForm.parola.value;
if (len_user.length<1 || len_pass.length<1) {
document.getElementById("eroare_rasp").innerHTML = "Te rugăm să completezi ambele câmpuri.";
}
if (len_user=="Narcis" && len_pass=="parola") {
window.open("file:///E:/Dropbox/Start-up/undealergam.ro/finale/adauga_traseu_formular_validari_lichid.html#","_self");
}
else {document.getElementById("eroare_rasp").innerHTML = "Combinația nume de utilizator-parolă este incorectă.";}
}//închide funcția

function resetForm() {
document.getElementById("login").reset();
}

function initialize(){
	var options = new Object();
  options.draggable = true;
  options.preserveViewport = true;
  directionsDisplay = new google.maps.DirectionsRenderer(options);
  var mapOptions = {
    zoom: 11,
    center: new google.maps.LatLng( 44.4325, 26.1039)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  directionsDisplay.setMap(map);
}

function initializeWithMarkersListener() {
  intialize();

  if( placeMarkers == true ) {
  	google.maps.event.addListener(map, 'click', function(e) {
    placeMarker(e.latLng, map);

  });
}
}



function transformPath( markers ){
        var coordinates = Array();

        function addValuesToVector(value, index, array){
          coordinates.push( value.lat() );
          coordinates.push( value.lng() );
    
         }


        markers.forEach( addValuesToVector );

        return coordinates ;
  }



function calcDistance(route)
{
	var total = 0;
	for( var i = 0; i < route.legs.length; i++ ) {
		total = total + route.legs[ i ].distance.value;
	}
	return total;
}

function calcDuration(route)
{
	var total = 0;
	for( var i = 0; i < route.legs.length; i++ ) {
		total = total + route.legs[ i ].duration.value;
	}
	return total;
}
function calcRoute( traseu ) {
	var markers_length = traseu.markers.length;
	if( markers_length < 2 ) {
		return;
	}
	if( markers_length != 2 ) {
		addLastWaypoint( traseu );
	}
	createAndSendRequest( traseu, handleDirectionsResponseWithPrint );
}

function addLastWaypoint( traseu ){
  var waypoint = new Object();
    waypoint.location = traseu.markers[ traseu.markers.length - 2 ];
    waypoint.stopover = false;
    traseu.waypoints.push( waypoint );
}

function createAndSendRequest( traseu, callback ){
  start = traseu.markers[ 0 ];
  end = traseu.markers[ traseu.markers.length - 1 ];
  var request = {
          origin: start,
          destination: end,
          waypoints: traseu.waypoints,
          travelMode: google.maps.TravelMode.WALKING
      };
    
      directionsService.route(request, callback );
    
}

function drawPolyFromDirectionsResponse( response, status ){
   if (status != google.maps.DirectionsStatus.OK) 
       {
          //Here we'll handle the errors a bit better 
            alert('Directions failed: ' + status);
        
       }

   else {
        
            drawRoute( response.routes[0].overview_path );
          }
     
}

function handleDirectionsResponse( response, status ){
   if (status != google.maps.DirectionsStatus.OK) 
       {
          //Here we'll handle the errors a bit better 
            alert('Directions failed: ' + status);
           return -1;
       }

    else {
            directionsDisplay.setDirections(response);
          }
      return 1;
}


function handleDirectionsResponseWithPrint( response, status ){
    if(handleDirectionsResponse( response, status ) == 1){
      // Display the distance:
            document.getElementById('distance').innerHTML += 
                  calcDistance(response.routes[0]) + " meters";

            // Display the duration:
            document.getElementById('duration').innerHTML += 
                  calcDuration(response.routes[0]) + " seconds";
    }

}

function drawRoute( coordinates ){
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

function calcRouteFromScratch( traseu ){
  if( traseu.markers.length < 2 ) {
      alert('Received bad markers from server');
    return;
  }

  for( i =1; i < traseu.markers.length - 1; i++ ){
      var waypoint = new Object();
      waypoint.location = traseu.markers[ i ];
      waypoint.stopover = false;
      traseu.waypoints.push( waypoint );
  }
   console.log('drawing');
  createAndSendRequest( traseu, drawPolyFromDirectionsResponse );
  
}

function processReceivedRoutes(receivedRoutesDict) {
  console.log('procssingRoutes');
    for (var key in receivedRoutesDict) {
      console.log(key);
      traseu = vectorToTraseu( receivedRoutesDict[ key ] );
      calcRouteFromScratch( traseu ); 
    }

}

function vectorToTraseu( array ){
  var traseu = new Object();
  traseu.markers = new Array();
  traseu.waypoints = new Array();
  for( i = 0; i< array.length; i+= 2 ){
    traseu.markers.push( new google.maps.LatLng( array[ i ], array[ i+1 ] ) );
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
      coord = vectorToCoordinates( receivedRoutesDict[ key ] );
      drawRoute( coord ); //TODO DRAW THEM DIFFERENTLY
    }

}

function vectorToCoordinates( array ){
  var coordinates = Array()
  for( i = 0; i< array.length; i+= 2 ){
    coordinates.push( new google.maps.LatLng( array[ i ], array[ i+1 ] ) );
  }

  return coordinates;
}