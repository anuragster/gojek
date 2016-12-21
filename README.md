# gojek
README

Why have we chosen NodeJS - 

Node js is fast. Node js uses Chrome V8 engine to compile the code into native machine code. This enables Node js to run at lightning speed. In addition to this Node js doesn't block on I/O operations. Node js sends the task having I/O call back to the event loop and continues to execute rest of the programs. Node js has a diverse and ever increasing set of npm libraries.


Infrastructure requirements-

I have used an AWS t2.micro linux ec2 instance. This is minimum, which is required. 
t2.micro has a single CPU, 1 GB ram and upto 3.3 GHz of clock speed.

Setup instructions-

1. Install nodeJS on linux machine. For more details on how to install node js follow below url-

	https://nodejs.org/en/download/package-manager/

2. Install mongo db on linux machine. For more details on how to install mongo db follow below url-
	
	https://docs.mongodb.com/v3.0/administration/install-on-linux/
	
3. Execute below set of steps to setup project on linux

	a. Create a new folder. cd to this new folder.
	b. sudo npm install express-generator -g
	c. express rest-server
	d. cd rest-server

	d.replace the following files-
		cp {$GIT_PROJECT}/app.js .
		cp {$GIT_PROJECT}/config.js .
		cp {$GIT_PROJECT}/package.json .
		cp {$GIT_PROJECT}/routes/driverroute.js routes/
		cp -r {$GIT_PROJECT}/controllers/ .
		cp -r {$GIT_PROJECT}/test/ .
		cp -r {$GIT_PROJECT}/models/ .
	
	e. Run the following npm install commands in the sequence-
		npm install
		npm install mongoose --save
		npm install method-override --save
		npm install mocha --save
		npm install chai --save
		npm install chai-http --save

	f. open config.js and ensure that mongoUrl and port are correctly configured

4. Run Test - Run "npm test" to ensure that all the testcases are successful
	
5. Load Test - Follow the below steps to run the load test-

	a. sudo npm install -g loadtest
	b. Run "testserver-loadtest"
	c. In a duplicate session run the following load commands one by one. Both these tests have concurrency as 20-
		
		loadtest -t 10 -c 20 http://35.164.165.247:7357/drivers?latitude=1&longitude=1.99999999&radius=1000&limit=2/
		loadtest -t 10 -c 20 --rps 900 --data '{"latitude": 2, "longitude" : 5, "accuracy" : 10}' -T 'application/json' -m PUT http://35.164.165.247:7357/drivers/1/location

6. Run "npm start" to start the node server.
	
7. Rest APIs - I have implemented 3 rest APIs POST, PUT and GET. POST creates a driver record, PUT updates the driver location and GET fetches the list of drivers based on the input parameters such as location, radius etc-
	a. POST /drivers   request body json - {'id': '1', 'latitude': '1', 'longitude' : '2', 'accuracy' : '6'} returns the created record.
	b. PUT /drivers/1/location request body json - {"latitude": 2, "longitude" : 5, "accuracy" : 10} returns the updated record.
	c. GET /drivers?latitude=1&longitude=1.99999999&radius=1000&limit=2 returns the JSON list of driver records
	
Note - All the operations are run in rest-server folder.
