var Verrichting = require('./verrichting.model.server');
var verrichtingDA = require('./verrichting.da.server');
var uuid = require('uuid');

var verrichtingRepo = function() {
	function create(data) {
		data.verrichtingId = uuid.v1();
		data.status = 'imported';
		
		return new Verrichting(data);
	}

	function save(verrichting) {
		return verrichtingDA.save(verrichting);
	}
};

module.exports = verrichtingRepo();