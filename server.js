var express = require('express');

var bodyParser = require('body-parser');

var _ = require('underscore');

var app = express();

var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

var todos = [];

var todoNextId = 1;

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

//GET /todos?completed = true
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredtodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredtodos = _.where(filteredtodos, {
			completed: true
		});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredtodos = _.where(filteredtodos, {
			completed: false
		});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredtodos = _.filter(filteredtodos, function(todo) {
			console.log(todo);
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}
	res.json(filteredtodos);

});

//get /todos/:id
app.get('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	var matchedToDo = _.findWhere(todos, {
		id: todoId
	});

	if (matchedToDo) {
		res.json(matchedToDo);
	} else {
		res.status(404).send();
	}
});


app.post('/todos', function(req, res) {
	//var body = req.body;
	var body = _.pick(req.body, 'description', 'completed');
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(404).send();
	}
	body.description = body.description.trim();
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});


//delete /todos/:id
app.delete('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	var matchedToDo = _.findWhere(todos, {
		id: todoId
	});

	if (matchedToDo) {
		todos = _.without(todos, matchedToDo);
		res.json(matchedToDo);
	} else {
		res.status(404).json({
			"error": "No todo found with that id"
		});
	}
});

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	var matchedToDo = _.findWhere(todos, {
		id: todoId
	});



	if (!matchedToDo) {
		return res.status(404).send();
	}

	var body = _.pick(req.body, 'description', 'completed');



	var validAttributes = {};

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		res.status(400).send();
	}


	//update here
	_.extend(matchedToDo, validAttributes);

	res.json(matchedToDo);

});

app.listen(PORT, function() {
	console.log('express listening on port :' + PORT);
});