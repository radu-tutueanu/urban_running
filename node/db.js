var mysql = require('db-mysql');

module.exports = {
  insertUser: function (userName, password, birthDate, city, country) {
     console.log( 'added user' + userName );
     insert('utilizatori', ['user_name', 'parola', 'data_nastere', 'oras', 'tara', 'data_creare'],
      [userName, password, birthDate, city, country, 'sysdate()']);
  },
  insertTraseu: function () {
 
  },

  verifyPassword: function () {
    // whatever
  },

  a : 'eee'
};

HOSTNAME = 'localhost';
USERNAME = 'root';
PASSWORD = 'radu90';
DATABASE = 'undealergam';

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

function insertCallback( error, result){
    if (error) {
                        console.log('ERROR: ' + error);
                        return;
                }
                console.log('GENERATED id: ' + result.id);
}
