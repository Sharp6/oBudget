var Verrichting = require('./verrichting.model.server');
var verrichtingDA = require('./verrichting.da.server');

var classifiers = require('../classifier');

var uuid = require('uuid');
var checksum = require('checksum');
var moment = require('moment-timezone');

var verrichtingRepo = function() {
	var _verrichtingen = [];

	function _instantiateVerrichting(data) {
		var verrichting = new Verrichting(data);
		return classifiers.businessRuleClassifier.classify(verrichting)
			.then(function(category) {
				verrichting.categoryByBusinessRuleClassifier = category;
				_verrichtingen.push(verrichting);
				return verrichting;
			});
	}

	function create(data) {
		var augmentedData = {};
    for (var dataAttribute in data) { augmentedData[dataAttribute] = data[dataAttribute]; }

		augmentedData.verrichtingId = uuid.v4();
		augmentedData.status = 'imported';
		augmentedData.csum = checksum(data.bedrag + data.datum + data.mededeling);
		augmentedData.datum = moment.tz(data.datum, "DD-MM-YYYY", "Europe/Brussels");
		augmentedData.datumDisplay = augmentedData.datum.format("DD/MM/YYYY");
		augmentedData.periodiciteit = "maandelijks";
		// add timestamp?

		var newVerrichting = new Verrichting(augmentedData);
		//var newVerrichting = _instantiateVerrichting(augmentedData);
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
						return _instantiateVerrichting(verrichtingData);
					})
					.then(function(newVerrichting) {
						resolve(newVerrichting);
					})
					.catch(function(err) {
						reject("Err in verrichtingRepo: " + err);
					});
			}
		});
	}

	function getVerrichtingByData(verrichtingData) {
		var verrichting = _verrichtingen.find(function(verrichting) {
			return verrichting && verrichting.verrichtingId === verrichtingData.verrichtingId;
		});
		if(verrichting) {
			return Promise.resolve(verrichting);
		} else {
			return _instantiateVerrichting(verrichtingData);
		}
	}

	function getVerrichtingenByData(verrichtingenData) {
		var promises = verrichtingenData.map(function(verrichtingData) {
			return getVerrichtingByData(verrichtingData);
		});
		return Promise.all(promises);
	}

	function save(verrichting) {
		return verrichtingDA.save(verrichting)
			.then(function() {
				return verrichting;
			});
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
	function findLastVerrichtingForBank(bankName) {
		return verrichtingDA.findLastVerrichtingForBank(bankName)
			.then(function(response) {
				return getVerrichtingByData(response);
			});
	}

	function findVerrichtingenForBank(bankName) {
		console.log("VERRICHTINGREPO: retrieving verrichtingen for", bankName);
		return verrichtingDA.search({
			bank: bankName
		})
		.then(function(response) {
			console.log("VERRICHTINGREPO: returning verrichtingen by data for", bankName);
			return getVerrichtingenByData(response.results);
		});
	}

	function findVerrichtingenForBankBefore(bankName, endDate) {
		return verrichtingDA.search({
			bank: bankName,
			eindDatum: endDate
		})
		.then(function(response) {
			return getVerrichtingenByData(response.results);
		});
	}

	function findVerrichtingenWithCategorie(categorie) {
		return verrichtingDA.search({
			categorie: categorie
		})
		.then(function(response) {
			return getVerrichtingenByData(response.results);
		});
	}

	function search(query) {
		return verrichtingDA.search(query)
			.then(function(response) {
				return getVerrichtingenByData(response.results)
					.then(function(verrichtingen) {
						response.verrichtingen = verrichtingen;
						return response;
					});
			});
	}

	return {
		create: create,
		getAll: getAll,
		getVerrichtingById: getVerrichtingById,
		save: save,
		handleDuplicates: handleDuplicates,
		findLastVerrichtingForBank: findLastVerrichtingForBank,
		findVerrichtingenForBankBefore: findVerrichtingenForBankBefore,
		findVerrichtingenWithCategorie: findVerrichtingenWithCategorie,
		findVerrichtingenForBank: findVerrichtingenForBank,
		search: search
	};
};

module.exports = new verrichtingRepo();