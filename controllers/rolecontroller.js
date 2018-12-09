const model = require('../models');

module.exports.get_roles = function(){
	return model.role.findAll().then(res => {
		return res.map(item => item.dataValues);
	}).catch(err => {
		console.log(err);
	});
};