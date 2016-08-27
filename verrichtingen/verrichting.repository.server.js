var Verrichting = require('./verrichting.model.server');
var verrichtingDA = require('./verrichting.da.server');
var uuid = require('uuid');
var checksum = require('checksum');
var moment = require('moment-timezone');

var verrichtingRepo = function() {
	var _verrichtingen = [];

	function create(data) {
		var augmentedData = {};
    for (var dataAttribute in data) { augmentedData[dataAttribute] = data[dataAttribute]; }

		augmentedData.verrichtingId = uuid.v4();
		augmentedData.status = 'imported';
		augmentedData.csum = checksum(data.bedrag + data.datum + data.mededeling);
		augmentedData.datum = moment.tz(data.datum, "DD-MM-YYYY", "Europe/Brussels");
		// add timestamp?

		var newVerrichting = new Verrichting(augmentedData);
		_verrichtingen.push(newVerrichting);
		
		return newVerrichting;
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
			var verrichting = _verrichtingen.find(function(verrichting) {
				return verrichting && verrichting.verrichtingId === verrichtingId;
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
						reject("Err in verrichtingRepo: " + err);
					});
			}
		});
	}

	function getVerrichtingByData(verrichtingData) {
		return new Promise(function(resolve,reject) {
			var verrichting = _verrichtingen.find(function(verrichting) {
				return verrichting && verrichting.verrichtingId === verrichtingData.verrichtingId;
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

	function getVerrichtingenByData(verrichtingenData) {
		var promises = verrichtingenData.map(function(verrichtingData) {
			return getVerrichtingByData(verrichtingData);
		});
		return Promise.all(promises);
	}

	function save(verrichting) {
		return verrichtingDA.save(verrichting);
	}

	// very ugly, refactor!
	function handleDuplicates(csum) {
		return verrichtingDA.search({
			csum: csum
		})
		.then(function(response) {
			if(response.count > 1) {
				// We have duplicates in the checksum!
				var promises = response.results.map(function(verrichtingData) {
					return getVerrichtingByData(verrichtingData);
				});
				return Promise.all(promises)
					.then(_resolveDuplicates);
			} else {
				// We have no duplicates in the checksum
				return new Promise(function(resolve, reject) {
					resolve("No duplicates for this checksum.");
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
			var randomVerrichting = duplicatesArray.splice(0,1)[0];
			randomVerrichting.status = "notDuplicate";
			return verrichtingDA.save(randomVerrichting)
				.then(function() {
					return verrichtingDA.removeBulk(duplicatesArray);
				})
				.then(function() {
					duplicatesArray.forEach(function(verrichting) {
						_verrichtingen.splice(_verrichtingen.indexOf(verrichting), 1);
					});
					return Promise.resolve();
				});
		}
	}

	// FINDERS
	function findVerrichtingenForBankBefore(bankName, endDate) {
		return verrichtingDA.search({
			bank: bankName,
			eindDatum: endDate
		})
		.then(function(response) {
			return getVerrichtingenByData(response.results);
		});
	}

	return {
		create: create,
		getAll: getAll,
		getVerrichtingById: getVerrichtingById,
		save: save,
		handleDuplicates: handleDuplicates,
		findVerrichtingenForBankBefore: findVerrichtingenForBankBefore
	};
};

module.exports = new verrichtingRepo();