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
		//console.log("REPO", augmentedData.datum.toString());
		// add timestamp?

		var newVerrichting = new Verrichting(augmentedData);
		console.log("REPO: ADDING TO _VERRICHTINGEN " + newVerrichting.verrichtingId);
		_verrichtingen.push(newVerrichting);
		
		return newVerrichting;
	}

	function getAll() {
		return verrichtingDA.getAll()
			.then(function(verrichtingenData) {
				console.log("REPO GETALL, LENGTH:", verrichtingenData.length);
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
						console.log("REPO: ADDING TO _VERRICHTINGEN " + newVerrichting.verrichtingId);
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
				console.log("REPO: ADDING TO _VERRICHTINGEN " + newVerrichting.verrichtingId);
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
				// We have duplicates in the checksum!
				var promises = response.results.map(function(verrichtingData) {
					return getVerrichtingByData(verrichtingData);
				});
				return Promise.all(promises)
					.then(_resolveDuplicates);
			} else {
				// We have no duplicates in the checksum
				return new Promise(function(resolve, reject) {
					resolve();
				});
			}
		});
	}

	function _resolveDuplicates(duplicatesArray) {
		console.log("DUPLICATERESOLVER: got a duplicatesArray for checksum", duplicatesArray[0].csum, "of length", duplicatesArray.length);
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
			console.log("DUPLICATERESOLVER: splicing duplicatesArray, length is now", duplicatesArray.length);
			console.log("DUPLICATERESOLVER: randomVerrichting", randomVerrichting.verrichtingId);
			randomVerrichting.status = "notDuplicate";
			return verrichtingDA.save(randomVerrichting)
				.then(function() {
					console.log("DUPLICATERESOLVER: DAREMOVEBULKING " + duplicatesArray.length + " verrichtingen.");
					return verrichtingDA.removeBulk(duplicatesArray);
				})
				.then(function() {
					console.log("DUPLICATERESOLVER: SPLICING " + duplicatesArray.length + " verrichtingen.");
					duplicatesArray.forEach(function(verrichting) {
						_verrichtingen.splice(_verrichtingen.indexOf(verrichting), 1);
					});
					return Promise.resolve();
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