module.exports = function(sequelize, Sequelize) {

	const Task = sequelize.define('task',
		{
			id: {
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			id_creater: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			deadline: {
				type: Sequelize.DATE,
				allowNull: false
			},
			file: {
				type: Sequelize.STRING,
				allowNull: true
			},
			responsible: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		},
		{
			charset: 'utf8',
			collate: 'utf8_general_ci',
			timestamps: false
		}
	);

	Task.associate = function(models) {
		Task.belongsTo(models.user, {as: 'creater', foreignKey: 'id_creater', targetKey: 'id'});
		Task.belongsTo(models.user, {as: 'respon', foreignKey: 'responsible', targetKey: 'id'});
	};

	return Task;

};