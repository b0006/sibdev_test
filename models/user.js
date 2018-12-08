module.exports = function(sequelize, Sequelize) {

    let User = sequelize.define('user',
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
            password: {
                type: Sequelize.STRING,
                notEmpty: true,
                allowNull: false
            },
            role: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        },
        {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: true
        }
    );

    return User;

};