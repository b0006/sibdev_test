const model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

function new_owner(owner_id, respon_id) {
	const data = {
		userId: owner_id,
		res_id: respon_id
	};

	model.responsible.destroy({
		where: {
			[Op.or]: [{userId: owner_id}, {res_id: respon_id}]
		}
	}).catch(err => {
	    console.log(err);
	});

	return model.responsible.create(data).then(result => {
		if(result){
		   return true;
		}
	}).catch(err => {
    	console.log(err);
	});
}

module.exports.set_owner = function(req, res) {
	const data = req.body;
	if(typeof data.res_id !== 'undefined') {
		if (data.res_id.constructor.name === 'Array') {
			data.res_id.map(id => {
				new_owner(data.owner_id, id);
			});
		}
		else {
			new_owner(data.owner_id, data.res_id);
		}
	}
	else {
		data.res_id = 0;
		new_owner(data.owner_id, data.res_id);
	}

	res.redirect('/admin_tree');
};

