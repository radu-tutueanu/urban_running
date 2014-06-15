var mysql = require('db-mysql');

function runquerry( querry, callback){
    new mysql.Database({
        hostname: 'localhost',
        user: 'root',
        password: 'radu90',
        database: 'undealergam'
    }).connect(function(error) {
        if (error) {
            return console.log('CONNECTION error: ' + error);
        }
        this.query(querry).
        execute(callback(error, rows, cols));
    });
}

function insert( table, columns, values){
    new mysql.Database({
        hostname: 'localhost',
        user: 'root',
        password: 'radu90',
        database: 'undealergam'
    }).connect(function(error) {
        if (error) {
            return console.log('CONNECTION error: ' + error);
        }
        this.query( table, columns, values ).execute( insertCallback )
    }

    function insertUser( userName, password, birthDate, city, country){


    }

    function insertCallback( error, result){
        if (error) {
            console.log('ERROR: ' + error);
            return;
        }
        console.log('GENERATED id: ' + result.id);
    }
