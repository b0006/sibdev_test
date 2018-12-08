module.exports = function(sequelize, Sequelize) {

    let Role = sequelize.define('role',
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

    // Role.associate = function(models) {
    //     // User.belongsTo(models.role, {as: "r", primaryKey: 'id', targetKey: 'id'});
    //     Role.hasMany(models.user, {as: "r", primaryKey: 'id', targetKey: 'id'});
    // };

    return Role;

};