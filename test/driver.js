"use strict";
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Driver = require('../models/driver');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);
var driverid = '1';
describe('Drivers', () => {
    beforeEach((done) => { 
        Driver.remove({}, (err) => { 
           done();         
        });     
});

describe('/GET drivers', () => {
      it('it should GET all the drivers', (done) => {
        chai.request(app)
            .get('/drivers?latitude=1&longitude=2')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });
})

describe('/PUT driver', () => {
    it('It should not update a non existing driver!!', (done) => {
        let driver = {
	    'id' : driverid,
            'latitude': 1,
            'longitude': 2,
	    'accuracy': 5
        }
        chai.request(app).put('/drivers/'+driverid+'/location').send(driver).end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        });
    });
});


describe('/POST driver', () => {
    it('It should create a new driver', (done) => {
	let driver1 = {
	    'id': '1', 'latitude': '1', 'longitude' : '2', 'accuracy' : '6'
	};
	let driver2 = {
            'id': '2', 'latitude': '1', 'longitude' : '2', 'accuracy' : '6'
        };
	let driver3 = {
            'id': '3', 'latitude': '1', 'longitude' : '2', 'accuracy' : '6'
        };
	let driver4 = {
            'id': '4', 'latitude': '1', 'longitude' : '2', 'accuracy' : '6'
        };
	chai.request(app)
	    .post('/drivers').send(driver1).end((err, res) => {
	    	res.should.have.status(200);
                res.body.should.be.a('object');

		chai.request(app)
                .post('/drivers').send(driver2).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
			chai.request(app)
                	.post('/drivers').send(driver3).end((err, res) => {
                    	res.should.have.status(200);
                    	res.body.should.be.a('object');
				

				chai.request(app)
               			 .post('/drivers').send(driver2).end((err, res) => {
                   		 res.should.have.status(200);
                   		 res.body.should.be.a('object');
				 done();
               			 });
                	});
                });
	    })
    });
});

describe('/PUT driver', () => {
    it('It should update a driver location with lat,lng and accuracy successfully', (done) => {
        let driver = {
            'latitude': '1',
            'longitude': '2',
            'accuracy': '3'
        }
        chai.request(app).put('/drivers/'+driverid+'/location').send(driver).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            console.log('latitude - ' + JSON.stringify(res));
            res.body.should.have.property('latitude').eql('1');
            res.body.should.have.property('longitude').eql('2');
            res.body.should.have.property('accuracy').eql('3');

            done();
        });
    });
});

describe('/PUT driver', () => {
    it('It should not update a driver location with invalid lat,lng.', (done) => {
        let driver = {
            'latitude': '100',
            'longitude': '2',
            'accuracy': '3'
        }
        chai.request(app).put('/drivers/'+driverid+'/location').send(driver).end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a('object');
            console.log('latitude - ' + JSON.stringify(res));
            res.body.should.have.property('errors');

            done();
        });
    });
});


describe('/PUT driver', () => {
    it('It should not update a driver location for invalid driverId', (done) => {
        let driver = {
            'latitude': '1',
            'longitude': '2',
	    'accuracy' : '3'
        }
        chai.request(app).put('/drivers/'+50001+'/location').send(driver).end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            done();
        });
    });
});


describe('/PUT driver', () => {
    it('It should not update a driver location without lat,lng or accuracy', (done) => {
	let driver = {
	    'latitude': '1',
	    'longitude': '2'
	}
	chai.request(app).put('/drivers/'+driverid+'/location').send(driver).end((err, res) => {
	    res.should.have.status(422);
	    res.body.should.be.a('object');
	    res.body.should.have.property('errors');
	    done();
	});
    });
});

describe('/GET drivers', () => {
      it('it should GET all the drivers in the given location, radius and limit', (done) => {
        chai.request(app)
            .get('/drivers?latitude=1&longitude=2&radius=100&limit=2')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.below(3);
              done();
            });
      });
  });

describe('/GET drivers', () => {
      it('it should fail with 400 response code because of bad request', (done) => {
        chai.request(app)
            .get('/drivers?latitude=100&longitude=2&radius=100&limit=2')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
		res.body.should.have.property('errors');
              done();
            });
      });
  });

