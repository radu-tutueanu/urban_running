var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/undealergam?keepAlive=1';

/* Create the database connection */
mongoose.connect(dbURI);

var db = mongoose.connection;


/*** CONNECTION EVENTS ***/
/* When successfully connected */
mongoose.connection.on('connected', function() {
	console.log('Mongoose connection open to ' + dbURI);
});

/* If the connection throws an error */
mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});

/* When the connection is disconnected */
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose connection disconnected');
});

/* If the Node process ends, close the Mongoose connection */
process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose connection disconnected through app termination');
		process.exit(0);
	});
});

/* Defining schemas */

var Schema = mongoose.Schema;


var routeSchema = new Schema({
	id: Schema.Types.ObjectId,
	userId: Number,
	distance: Number,
	name: {
		type: String,
		trim: true
	},
	info: {
		when: {
			type: String,
			trim: true
		},
		where: {
			type: String,
			trim: true
		},
		traffic: {
			type: Number,
			min: 1,
			max: 5
		},
		dogs: {
			type: Number,
			min: 1,
			max: 5
		},
		lighting: {
			type: Number,
			min: 1,
			max: 5
		},
		safety: {
			type: String,
			trim: true
		},
		observations: {
			type: String,
			trim: true
		}
	}
});


var userSchema = new Schema({
	id: Schema.Types.ObjectId,
	name: {
		type: String,
		trim: true,
		unique: true
	},
	password: {
		type: String,
		trim: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	city: {
		type: String,
		trim: true
	},
	country: {
		type: String,
		trim: true
	},
});

/*Create methods for the schemas - example find*/
/*TODO*/

/*Create models = objects we can work with*/
var routeModel = mongoose.model('Route', routeSchema);
var userModel = mongoose.model('User', userSchema);

/* Functions used in other parts of the program */
module.exports = {

	createUser: function(userName, passwd, city, country) {
		console.log("Creating user : " + userName)
		var properties = {
			name: userName,
			password: passwd,
			city: city,
			country: country,
		};
		var user = new userModel(properties);
		user.save(saveObjectCallback);

	},

}

/* Functions used internally */
function saveObjectCallback(err, object) {
	console.log("Saved callback : ");
	if (err) return console.error(err);
	console.log("Saved : " + object);
}