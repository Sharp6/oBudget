var Verrichting = require('./verrichting.model.server');
var verrichtingDA = require('./verrichting.da.server');
var uuid = require('uuid');

var verrichtingRepo = function() {
	function create(data) {
		data.verrichtingId = uuid.v1();
		data.status = 'imported';
		
		return new Verrichting(data);
	}

	function getAll() {
		return verrichtingDA.getAll()
			.then(function(verrichtingenData) {
				return verrichtingenData.map(function(verrichtingData) {
					return new Verrichting(verrichtingData);
				});
			});
	}

	function save(verrichting) {
		console.log("REPO: SAVING");
		return verrichtingDA.save(verrichting);
	}

	return {
		create: create,
		getAll: getAll,
		save: save
	};
};

module.exports = new verrichtingRepo();