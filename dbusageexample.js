var db = require('./mongodb');

db.createUser('Undefined', '123123',  'Baicoi', 'RO')
//db.insertTraseu('narcis2', 'alergare usoara2', 22.3, 'seara','trotuar', 2, 4, 4, 'te mananca lupii', 'frumos', [44.41367383, 26.10282897, 44.41367383, 26.10282897, 
//	44.414089110, 26.102625802, 44.414258189, 26.102995271]);

db.getInfoTraseu(8,db.selectInfoCallback);
//db.getTrasee(db.selectInfoCallback);

