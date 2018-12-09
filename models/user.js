module.exports = function(sequelize, Sequelize) {

	const User = sequelize.define('user',
		{
			id: {
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			email: {
				type: Sequelize.STRING,
				validate: {
					isEmail: true
				},
				allowNull: false
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			password: {
				type: Sequelize.STRING,
				notEmpty: true,
				allowNull: false
			},
			pid: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: -1
			},
			role: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1
			}
		},
		{
			charset: 'utf8',
			collate: 'utf8_general_ci',
			timestamps: true
		}
	);

	// User.associate = function(models) {
	//     // User.belongsTo(models.role, {as: "r", primaryKey: 'id', targetKey: 'id'});
	//     User.hasMany(models.role, {as: "r", primaryKey: 'id', targetKey: 'role'});
	// };

	return User;

};