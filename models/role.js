module.exports = function(sequelize, Sequelize) {

	const Role = sequelize.define('role',
		{
			id: {
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			title: {
				type: Sequelize.STRING(50),
				allowNull: false
			},
			admin: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			}
		},
		{
			charset: 'utf8',
			collate: 'utf8_general_ci',
			timestamps: false
		}
	);

	return Role;

};