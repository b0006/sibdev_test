module.exports = function(sequelize, Sequelize) {

    let Task = sequelize.define('task',
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

    return Task;

};