module.exports = function(sequelize, Sequelize) {

	const Responsible = sequelize.define('responsible',
		{
			id: {
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			owner_id: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			res_id: {
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

	return Responsible;
};