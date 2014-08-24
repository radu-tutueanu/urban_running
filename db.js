var mysql = require( 'db-mysql' );
var common = require( './common' );

module.exports = {
	insertUser: function( userName, password, birthDate, city, country ) {
		console.log( 'added user' + userName );
		insert( 'utilizatori', [ 'user_name', 'parola', 'data_nastere', 'oras', 'tara', 'data_creare' ], [ userName, password, birthDate, city, country, 'sysdate()' ] );
	},

	createUser: function( userName, password, date, city, country ) {

		request = "call inserare_utilizator(";
		request = request + wrapWithSingleQuotes( userName ) + ',' + wrapWithSingleQuotes( password ) + ',' + wrapWithSingleQuotes( date ) + ',' + wrapWithSingleQuotes( city ) + ',' + wrapWithSingleQuotes( country ) + ');';
		querry( request, querryHandler );
	},

	insertTraseu: function( userName, pathName, distance, whenField, whereField, traffic, dogsField, lightsField, securityField, obsField, coordinates ) {


		request = "call inserare_traseu(";
		request = request + wrapWithSingleQuotes( userName ) + ',' + wrapWithSingleQuotes( pathName ) + ',' + distance + ',' + wrapWithSingleQuotes( whenField ) + ',' + wrapWithSingleQuotes( whereField ) + ',' + traffic + ',' + dogsField + ',' + lightsField + ',' + wrapWithSingleQuotes( securityField ) + ',' + wrapWithSingleQuotes( obsField );
		request = addVectorToQuerry( request, coordinates ) + ');';
		querry( request, querryHandler );

	},


	getTrasee: function( socket ) {
		selectAll = "select a.id_traseu, a.nume_traseu,b.lat1, b.longit1, b.lat2, b.longit2, b.lat3, b.longit3, b.lat4, b.longit4, b.lat5, b.longit5, b.lat6, b.longit6, \
	b.lat7, b.longit7, b.lat8, b.longit8, b.lat9,b.longit9, b.lat10, b.longit10 \
	from trasee a, coordonate b  where a.id_traseu=b.id_traseu and a.id_traseu in (select id_traseu from trasee);";

		querry( selectAll, function( error, rows, cols ) {
			if ( error ) {
				console.log( 'ERROR: ' + error );
				return;
			}

			routesJson = {};

			for ( var i = rows.length - 1; i >= 0; i-- ) {
				route = rowToJsonRoute( rows[ i ] )
				routesJson[ route.name ] = route;
			};

			socket.emit( common.SEND_ALL_ROUTES, routesJson );
		} );
	},

	getInfoTraseu: function( id, socket ) {
		selectQuerry = "select t.nume_traseu, t.distanta, d.info_cand, d.info_unde, d.info_trafic, d.info_caini, \
	d.info_lumini, d.info_siguranta,d.info_obs, c.lat1, c.longit1, c.lat2, c.longit2, c.lat3, \
	c.longit3, c.lat4, c.longit4, c.lat5, c.longit5, c.lat6, c.longit6, c.lat7, c.longit7, c.lat8, \
	c.longit8, c.lat9,c.longit9, c.lat10, c.longit10 from detalii_traseu d, coordonate c, \
	trasee t where d.id_traseu=c.id_traseu and t.id_traseu=c.id_traseu and c.id_traseu=" + id + ';';
		querry( selectQuerry, function( error, rows, cols ) {
			if ( error ) {
				console.log( 'ERROR: ' + error );
				return;
			}
			route = {}
			route[ 'name' ] = rows[ 0 ][ 'nume_traseu' ];
			route[ 'coordinates' ] = getCoordArrayFromRow( rows[ 0 ] );
			route[ 'distance' ] = rows[ 0 ][ 'distanta' ];
			route[ 'whenField' ] = rows[ 0 ][ 'info_cand' ];
			route[ 'whereField' ] = rows[ 0 ][ 'info_unde' ];
			route[ 'trafficField' ] = rows[ 0 ][ 'info_trafic' ];
			route[ 'dogsField' ] = rows[ 0 ][ 'info_caini' ];
			route[ 'lightsField' ] = rows[ 0 ][ 'info_lumini' ];
			route[ 'safetyField' ] = rows[ 0 ][ 'info_siguranta' ];
			route[ 'observationsField' ] = rows[ 0 ][ 'info_obs' ];
			socket.emit( common.SEND_ROUTE_INFO, route );
		} );

	},
	verifyPassword: function() {
		// whatever
	},

	a: 'eee'
};

var MAXCOORDx2 = 20;
HOSTNAME = 'localhost';
USERNAME = 'root';
PASSWORD = 'radu90';
DATABASE = 'undealergam';

//call inserare_utilizator('buton','passbuton','1995-06-07','Iasi','Romania');

function insert( table, columns, values ) {
	new mysql.Database( {
		hostname: HOSTNAME,
		user: USERNAME,
		password: PASSWORD,
		database: DATABASE
	} ).connect( function( error ) {
		if ( error ) {
			return console.log( 'CONNECTION error: ' + error );
		}
		this.query().insert( table, columns, values ).execute( insertCallback );
	} );
}

function addVectorToQuerry( querry, vector ) {
	var i = 0;

	if ( vector.length > 20 ) {
		console.error( "addVectorToQuerry: too many values " + vector.length );
		return querry;
	}

	for ( ; i <= vector.length - 1; i++ ) {
		querry = querry + ',' + vector[ i ];
	};

	for ( ; i < MAXCOORDx2; i++ ) {
		querry = querry + ',' + 'null';
	}


	return querry;
}

function insertCallback( error, result ) {
	if ( error ) {
		console.log( 'ERROR: ' + error );
		return;
	}
	console.log( 'GENERATED id: ' + result.id );
}

function querryHandler( error, rows, cols ) {
	if ( error ) {
		console.log( 'ERROR: ' + error );
		return;
	}
	console.log( rows.count + ' ROWS returned' );
}

function wrapWithSingleQuotes( word ) {
	return "'" + word + "'";
}

function rowToJsonRoute( row ) {
	route = {}
	route[ 'id' ] = row[ 'id_traseu' ];
	route[ 'name' ] = row[ 'nume_traseu' ];


	route[ 'coordinates' ] = getCoordArrayFromRow( row );

	return route;
}

function getCoordArrayFromRow( row ) {
	coordinates = [];

	for ( var i = 1; i < 11; i++ ) {
		lat = 'lat' + i;
		lng = 'longit' + i;
		if ( row[ lat ] != null ) {
			coordinates.push( row[ lat ] );
			coordinates.push( row[ lng ] );
		} else break;
	}
	return coordinates;
}

function querry( querryString, handler ) {
	console.log( "DB querry: " + querryString );
	new mysql.Database( {
		hostname: HOSTNAME,
		user: USERNAME,
		password: PASSWORD,
		database: DATABASE
	} ).connect( function( error ) {
		if ( error ) {
			return console.log( 'CONNECTION error: ' + error );
		}
		this.query( querryString ).execute( handler );
	} );
}