var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var driverSchema = new Schema({
	id: {
		type: String,
                required: true
	},
        latitude: {
                type: String,
                required: true
        },
        longitude: {
                type: String,
                required: true
        },
	accuracy: {
                type: String,
                required: true
        }
}, {
    timestamps: true
});


var Driver = mongoose.model('driver', driverSchema);

module.exports = Driver;

