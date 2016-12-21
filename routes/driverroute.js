var Todo = require('../models/driver');
var TodoController = require('../controllers/controller')(Todo);

module.exports = function(app){
	console.log('start route');
	
	app.get('/drivers', TodoController.getAllOp);

	app.get('/drivers/:id', TodoController.getOp);
	
	app.post('/drivers', TodoController.postOp);

	app.put('/drivers/:id/location', TodoController.updateOp);

	//app.delete('/api/todos/:todo_id', TodoController.DeleteTodo);
	console.log('end route');
}
