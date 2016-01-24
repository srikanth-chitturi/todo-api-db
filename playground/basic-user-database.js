var Sequelize = require('sequelize');
var sequelize = new Sequelize('UserBD', 'srikanth', 'chitturi',{
	'dialect': 'sqlite',
	'storage': __dirname+'/basic-user-database.sqlite'
});

var User = sequelize.define('user', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

sequelize.sync({force:true}).then(function() {
  return User.create({
    username: 'srikanthchitturi',
    birthday: new Date(1989, 2, 2)
  });
}).then(function(srikanth) {
  console.log(srikanth.get({
    plain: true
  }));
});