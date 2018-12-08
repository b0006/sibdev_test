let path = require('path');
let Sequelize = require('sequelize');
let config_db = require(path.join(__dirname, '..', 'config', 'config.json'))['database'];
let sequelize = new Sequelize(config_db.database, config_db.username, config_db.password, config_db);
let model = require('../models');

module.exports.get_roles = function(){
    return model.role.findAll().then(res => {
        return res.map(item => item.dataValues);
    }).catch(err => {
        console.log(err);
    })
};