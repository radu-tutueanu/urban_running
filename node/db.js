var mysql = require('db-mysql');



module.exports = {
  insertUser: function (userName, password, birthDate, city, country) {
   console.log( 'added user' + userName );
   insert('utilizatori', ['user_name', 'parola', 'data_nastere', 'oras', 'tara', 'data_creare'],
    [userName, password, birthDate, city, country, 'sysdate()']);
 },

 createUser: function ( userName, password, date, city, country){

  request = "call inserare_utilizator(";
    request = request + wrapWithSingleQuotes( userName ) + ',' 
    + wrapWithSingleQuotes( password ) + ',' + wrapWithSingleQuotes( date ) 
    + ',' + wrapWithSingleQuotes( city ) + ',' + wrapWithSingleQuotes( country ) + ');' ;
querry( request );
},

insertTraseu: function ( userName, pathName, distance, whenField, whereField, traffic, dogsField, lightsField, securityField, obsField, coordinates ) {
  
  
  request = "call inserare_traseu(";
    request = request +  wrapWithSingleQuotes( userName ) + ',' +  wrapWithSingleQuotes( pathName ) + ',' +  distance + ',' + wrapWithSingleQuotes( whenField ) + ',' 
    +  wrapWithSingleQuotes( whereField ) + ',' +  traffic  + ',' +  dogsField  + ',' + lightsField
    + ',' + wrapWithSingleQuotes( securityField ) + ',' + wrapWithSingleQuotes( obsField );
    request = addVectorToQuerry( request, coordinates )  + ');';
querry( request );

},


getTrasee: function() {

},

verifyPassword: function () {
    // whatever
  },

  a : 'eee'
};

var MAXCOORDx2 = 20;
HOSTNAME = 'localhost';
USERNAME = 'root';
PASSWORD = 'radu90';
DATABASE = 'undealergam';

//call inserare_utilizator('buton','passbuton','1995-06-07','Iasi','Romania');

function insert( table, columns, values){
  new mysql.Database({
    hostname: HOSTNAME,
    user: USERNAME,
    password: PASSWORD,
    database: DATABASE
  }).connect(function(error) {
    if (error) {
      return console.log('CONNECTION error: ' + error);
    }
    this.query().insert( table, columns, values ).execute( insertCallback );
  });
}

function addVectorToQuerry( querry, vector ){
  var i = 0;

  if (vector.length > 20) {
    console.error("addVectorToQuerry: too many values " + vector.length) ;
    return querry;
  }

  for (; i <= vector.length - 1; i++) {
    querry = querry + ',' + vector[i];
  };

  for(;i< MAXCOORDx2 ; i++){
    querry = querry + ',' + 'null';
  }

  
  return querry;
}

function insertCallback( error, result){
  if (error) {
    console.log('ERROR: ' + error);
    return;
  }
  console.log('GENERATED id: ' + result.id);
}



function querryHandler(error, rows, cols) {
  if (error) {
    console.log('ERROR: ' + error);
                        //console.log(this.query);
                        return;
                      }
                      console.log(rows.count + ' ROWS returned');
                    }

                    function wrapWithSingleQuotes( word ){
                      return "'" + word + "'";
                    }



                    function querry( querryString ) {
                     console.log( "DB querry: " + querryString);
                     new mysql.Database({
                      hostname: HOSTNAME,
                      user: USERNAME,
                      password: PASSWORD,
                      database: DATABASE
                    }).connect(function(error) {
                      if (error) {
                        return console.log('CONNECTION error: ' + error);
                      }
                      this.query( querryString ).execute( querryHandler );
                    });
                  }
