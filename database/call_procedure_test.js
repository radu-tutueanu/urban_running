var mysql = require('db-mysql');
new mysql.Database({
    hostname: 'localhost',
    user: 'root',
    password: 'Carlos11',
    database: 'undealergam'
}).connect(function(error) {
    if (error) {
        return console.log('CONNECTION error: ' + error);
    }//call inserare_utilizator('testare','test123','1995-06-07','Iasi','Romania'); -- exemplu apel
//this.query('SELECT * FROM ' + this.name ('utilizatori')).
//this.query('call inserare_utilizator('+this.name('apel_proc,')+this.name('parola_proc,')+this.name('1995-06-07')+this.name('Bucale')+this.name('Rumanski')+this.name(')')).
//this.query('call inserare_utilizator('+['ciocile','pass','1991-06-01','Giurgiu','Romania']+');').
this.query("call inserare_utilizator('test1','test2','1995-06-07','Iasi','Romania');").
        execute(function(error, rows, cols) {
                if (error) {
                        console.log('ERROR: ' + error);
                        //console.log(this.query);
                        return;
                }
                console.log(rows.length + ' ROWS inserted');
        });
   
});


