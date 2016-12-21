"use strict";

var TodoCtrl = function(Todo){

	var driverResource = {};

	driverResource.postOp = function(req, res, next){
		console.log('new Driver save request');
		console.log('req.body - ' + JSON.stringify(req.body));
		var newTodo = new Todo(req.body);
		newTodo.save(function(err, todo){
			if(err){
				console.log('Error while saving');
				res.json({errors: [err.message]});
				return;
			}
			console.log('SUCCESS - ' + todo);
			res.json(todo);
		});
	}

	driverResource.getAllOp = function(req, res, next){
		console.log('get all request for drivers');
		var latitude = req.query.latitude;
		var longitude = req.query.longitude;
		var radius = req.query.radius;
		var limit = req.query.limit;
		if(!(latitude && longitude) || (latitude > 90 || latitude < -90 || longitude > 90 || longitude < -90)){
                    //console.log('One of lat or lng is invalid!!' + latitude + longitude);
                    var obj = {};
                    obj.errors = [];
                    obj.errors[0] = 'Lat/Lng should be between +/- 90';
                    res.status(400);
                    res.json(obj);
                    return;
                }

		if(!radius){
		    radius = 500;
		}

		if(!limit){
		    limit = 10;
		}
		console.log('latitude - ' + latitude + ', longitude - ' + longitude + ', radius - ' + radius + ' and limit - ' + limit);
		// As an approximation we have assumed a constant conversion factor. However, converting radius to degree accurately isn't so straight forward.
		var radiusInDegrees = (radius/100000000);
		console.log('radiusInDegrees - ' + radiusInDegrees);
		var minLat = latitude - radiusInDegrees;
		var maxLat = parseFloat(latitude) + parseFloat(radiusInDegrees);
		var minLng = longitude - radiusInDegrees;
		var maxLng = parseFloat(longitude) + parseFloat(radiusInDegrees);
		console.log('minLat - ' + minLat + ', maxLat - ' + maxLat + ', minLng - ' + minLng + ' and maxLng - ' + maxLng);
                Todo.find({$and: [{'latitude' : {$lt: maxLat}}, {'latitude' : {$gt: minLat}}, {'longitude' : {$lt: maxLng}}, {'longitude' : {$gt: minLng}}]}).limit(limit).sort({createdAt : -1}).exec(function(err, todos){
                //Todo.find({}, function(err, todos){
			console.log('Inside exec!!');
                        if(err) {
				console.log('Error - ' + err);
                                res.json({errors: ["Something went wrong"]});
                                return
                        }
			console.log(todos);
                        res.json(todos);
                });
        }

	driverResource.getOp = function(req, res, next){
		var driverId = req.params.id;
		console.log('get request for driverId - ' + driverId);
		Todo.find({'id' : driverId}, function(err, todos){
			if(err) {
				res.json({errors: ["Something went wrong"]});
				return
			}
			res.json(todos);
		});
	}

	driverResource.updateOp = function(req, res, next){
		console.log('Update request!!');
		var latitude = req.body.latitude;
		var longitude = req.body.longitude;
		var accuracy = req.body.accuracy;
		if(!(latitude && longitude && accuracy) || (latitude > 90 || latitude < -90 || longitude > 90 || longitude < -90)){
		    console.log('One of lat, lng or accuracy is invalid!!' + latitude + longitude + accuracy);
		    var obj = {};
		    obj.errors = [];
		    obj.errors[0] = 'One of lat, lng or accuracy is invalid!!' + latitude + longitude + accuracy;
		    res.status(422);
		    res.json(obj);
		    return;
		}
		var driverId = req.params.id;
		if(driverId < -1 || driverId > 50000){
		    console.log('Driver id is invalid - ' + driverId);
		    res.status(404);
		    var obj = {};
                    obj.errors = ['Driver id is invalid - ' + driverId];
		    res.send(obj);
		    return;
		}
		console.log('Update request for driverId - ' + req.params.id + ", new lat - " + latitude + ", new lng - " + longitude + ", accuracy - " + accuracy);

		Todo.find({'id' : req.params.id}, function(err1, drivers){
		    console.log('Inside find block!' + drivers.length);
		    if(err1){ 
			console.log('Error - ' + err1);
			throw err1;
		    }
		    if(drivers!=null && drivers.length > 0 && drivers[0] != null){
			console.log('driver - ' + drivers[0]);
		        Todo.findOneAndUpdate({'id' : req.params.id}, {$set: {'latitude' : latitude, 'longitude' : longitude, 'accuracy' : accuracy}}, {new: true}, function(err, todo){
		            if(err) {
			        console.log('Error - ' +err);
			        res.json({status: false, error: ["Driver location is not updated"]});
		            }
		            console.log('UPDATE successful!!');
		            res.json(todo);
		        });
		    }else{
			console.log('Entry for driver with id ' + req.params.id + ' is not found!!');
			res.status(404);
			var obj = {};
			obj.errors = [];
                    	obj.errors[0] = 'Entry for driver with id ' + req.params.id + ' is not found!!';
			res.json(obj);
			return;
		    }
		});
	}

	return driverResource;
}

module.exports = TodoCtrl;
