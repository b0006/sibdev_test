"use strict";

let fs = require("fs");
let path = require("path");
let Sequelize = require("sequelize");
let config_db = require(path.join(__dirname, '..', 'config', 'config.json'))["database"];
let sequelize = new Sequelize(config_db.database, config_db.username, config_db.password, config_db);
let db = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        let model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;