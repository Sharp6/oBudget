var Verrichting = require('./verrichting.model.server');
var verrichtingDA = require('./verrichting.da.server');
var uuid = require('uuid');
var checksum = require('checksum');
var moment = require('moment');

var verrichtingRepo = function() {
	var _verrichtingen = [];

	function create(data) {
		data.verrichtingId = uuid.v1();
		data.status = 'imported';
		data.csum = checksum(data.bedrag + data.datum + data.mededeling);
		data.datum = moment(data.datum, "DD/MM/YYYY");
		// add timestamp?
		
		return new Verrichting(data);
	}

	function getAll() {
		return verrichtingDA.getAll()
			.then(function(verrichtingenData) {
				var promises = verrichtingenData.map(function(verrichtingData) {
					return getVerrichtingByData(verrichtingData);
				});
				return Promise.all(promises);
			});
	}

	function getVerrichtingById(verrichtingId) {
		return new Promise(function(resolve,reject) {
			var verriching = _verrichtingen.find(function(verrichting) {
				return verrichting.verrichtingId === verrichtingId;
			});
			if(verrichting) {
				resolve(verrichting);
			} else {
				// retrieve from db
				verrichtingDA.get(verrichtingId)
					.then(function(verrichtingData) {
						var newVerrichting = new Verrichting(verrichtingData);
						_verrichtingen.push(newVerrichting);
						resolve(newVerrichting);
					})
					.catch(function(err) {
						reject(err);
					});
			}
		});
	}

	function getVerrichtingByData(verrichtingData) {
		return new Promise(function(resolve,reject) {
			var verrichting = _verrichtingen.find(function(verrichting) {
				return verrichting.verrichtingId === verrichtingData.verrichtingId;
			});
			if(verrichting) {
				resolve(verrichting);
			} else {
				var newVerrichting = new Verrichting(verrichtingData);
				_verrichtingen.push(newVerrichting);
				resolve(newVerrichting);
			}
		});
	}

	function save(verrichting) {
		return verrichtingDA.save(verrichting);
	}

	function getDuplicates(verrichting) {
		
	}

	// very ugly, refactor!
	function handleDuplicates(csum) {
		return verrichtingDA.search({
			csum: csum
		})
		.then(function(response) {
			if(response.count > 1) {
				var promises = response.results.map(function(verrichtingData) {
					return getVerrichtingByData(verrichtingData);
				});
				return Promise.all(promises)
					.then(_resolveDuplicates);
			} else {
				return new Promise(function(resolve, reject) {
					resolve();
				});
			}
		});
	}

	function _resolveDuplicates(duplicatesArray) {
		// 1. check if one of the duplicates is already classified.
		var classifiedVerrichting = duplicatesArray.find(function(verrichting) {
			return verrichting.status === "classified";
		});
		if(classifiedVerrichting) {
			// 1a. if found, keep that one and delete the rest.
			var theRest = duplicatesArray.splice(duplicatesArray.indexOf(classifiedVerrichting), 1);
			return verrichtingDA.removeBulk(theRest);
		} else {
			// 1b. if not, keep a random one, set its state to notDuplicate, and delete the rest.
			randomVerrichting = duplicatesArray.splice(0,1);
			randomVerrichting.status = "notDuplicate";
			return verrichtingDA.save(randomVerrichting)
				.then(function() {
					return verrichtingDA.removeBulk(duplicatesArray);
				})
				.then(function() {
					duplicatesArray.forEach(function(verrichting) {
						_verrichtingen.splice(_verrichtingen.indexOf(verrichting), 1);
					});
				});
		}
	}

	return {
		create: create,
		getAll: getAll,
		save: save,
		handleDuplicates: handleDuplicates
	};
};

module.exports = new verrichtingRepo();