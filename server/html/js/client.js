function login(socket, username, password) {
  socket.emit('login', {
    'username': username,
    'password': password
  });
}


function sendCurrentRoute(route, routeJson) {

  routeJson[username]['distance'] = route.distance;
  routeJson[username]['coordinates'] = transformPath(current.markers);
  socket.emit('send_route', routeJson);

}


function createRouteJsonWithoutPoints(denumire, circulatie, caini, lumini, cand, unde, siguranta, observatii) {
  routeJson = {};
  routeProperties = {};
  routeProperties['name'] = denumire;
  routeProperties['info'] = {
    when: cand,
    where: unde,
    traffic: circulatie,
    dogs: caini,
    lighting: lumini,
    safety: siguranta,
    observations: observatii,
  }
  routeJson[username] = routeProperties;
  return routeJson;
}

function parseURLParams(url) {
  var queryStart = url.indexOf("?") + 1,
    queryEnd = url.indexOf("#") + 1 || url.length + 1,
    query = url.slice(queryStart, queryEnd - 1),
    pairs = query.replace(/\+/g, " ").split("&"),
    parms = {},
    i, n, v, nv;

  if (query === url || query === "") {
    return;
  }

  for (i = 0; i < pairs.length; i++) {
    nv = pairs[i].split("=");
    n = decodeURIComponent(nv[0]);
    v = decodeURIComponent(nv[1]);

    if (!parms.hasOwnProperty(n)) {
      parms[n] = [];
    }

    parms[n].push(nv.length === 2 ? v : null);
  }
  return parms;
}