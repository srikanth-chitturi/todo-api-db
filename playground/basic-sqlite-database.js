var Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined,undefined,undefined,{
	dialect:'sqlite',
	storage:'mydb.sqlite'
});


var Todo = sequelize.define('todo',{
	description:{
		type:Sequelize.STRING,
		allowNull:false,
		validate:{
			len:[1,250]
		}
	},
	completed:{
		type:Sequelize.BOOLEAN,
		allowNull:false,
		defaultValue:false
	}
});

sequelize.sync({force:true}).then(function(){
	console.log('Synchronized');

	/*Todo.findAll({
		where:{
			description:{
				$like : '%Take%'	
			}
		}
		
	}).then(function(todos){
		todos.forEach(function(todo){
			console.log(todo.toJSON());
		});
	});*/
	Todo.create({
		description:""
	}).then(function(todo){
		return Todo.create({
			description:'Write IELTS',
			completed:true
		});
	}).then(function(){
		return Todo.findById(3)
	}).then(function(todo){
		if(todo){
			console.log(todo.toJSON());
		}
		else
		{
			console.log('Not todo found');
		}
	}).catch(function(e){
		console.log(e);
	});

});