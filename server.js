var express = require('express');

var bodyParser = require('body-parser');

var _ = require('underscore');

var app = express();

var PORT = process.env.PORT || 3000;

var db = require('./db.js');

app.use(bodyParser.json());

var todos = [];

var todoNextId = 1;

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

//GET /todos?completed = true
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
			where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
			where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.trim().length > 0) {
			where.description =
			{
				$like : '%'+query.q+'%'
			}		
	}

	db.todo.findAll({where:where}).then(function(todos){
		res.json(todos);
	},function(e){
		res.status(500).send();
	})

});

//get /todos/:id
app.get('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo){
		if(!!todo){
			res.json(todo.toJSON());
		}
		else{
			res.status(404).send();
		}
	},function(e){
			res.status(500).send();
	});

});


app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	db.todo.create({
		description:body.description,
		completed:body.completed
	}).then(function(todo){
		res.json(todo.toJSON());
	},function(e){
		res.status(400).json(e);
	})	
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

db.sequelize.sync().then(function(){
	app.listen(PORT, function() {
		console.log('express listening on port :' + PORT);
	});
});
