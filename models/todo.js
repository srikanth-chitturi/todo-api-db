
module.exports = function(Sequelize,DataTypes){
	return Sequelize.define('todo',{
		description:{
			type:DataTypes.STRING,
			allowNull:false,
			validate:{
				len:[2,225]
			}
		},
		completed:{
			type:DataTypes.BOOLEAN,
			allowNull:false,
			defaultValue:false
		}
	});
}