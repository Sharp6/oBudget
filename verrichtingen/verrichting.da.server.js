var mongoose = require('mongoose');
var moment = require('moment');

var VerrichtingDA = function() {
	var verrichtingSchema = new mongoose.Schema({
		verrichtingId: String,
		bankRef: String,
		datum: Date,
		bedrag: Number,
		rekeningTegenpartij: String,
		valuta: String,
		naamTegenpartij: String,
		type: String,
		mededeling: String,
		info: String,
		bank: String,
		status: String,
		csum: String,
		categorie: String,
		datumDisplay: String,
		periodiciteit: String,
		manualLabel: String,
		recurringYearly: Boolean
	});

	var VerrichtingModel = mongoose.model('Verrichting', verrichtingSchema);

	function getAll() {
		return new Promise(function(resolve,reject) {
			VerrichtingModel.find().sort({datum: 'desc'}).exec(function(err,doc) {
				if(err) {
					reject(err);
				} else {
					resolve(doc);
				}
			});
		});
	}

	function get(verrichtingId) {
		return new Promise(function(resolve,reject) {
			VerrichtingModel.find({verrichtingId: verrichtingId}, function(err,result) {
				if(err) {
					return reject(err);
				} else {
					resolve(result[0]);
				}
			});
		});
	}

	function removeAll() {
		return new Promise(function(resolve,reject) {
			VerrichtingModel.remove({}, function(err,result) {
				if(err) {
					return reject(err);
				}
				return resolve(result);
			});
		});
	}

	function removeBulk(verrichtingen) {
		var promises = verrichtingen.map(function(verrichting) {
			return remove(verrichting);
		});
		return Promise.all(promises);
	}

	function remove(verrichting) {
		return new Promise(function(resolve,reject) {
			VerrichtingModel.remove({ verrichtingId: verrichting.verrichtingId }, function(err,result) {
				if(err) {
					return reject(err);
				}
				return resolve(result);
			});
		});
	}

	function search(queryParams) {
		console.log("VERRICHTINGDA: executing search for", queryParams);
		return new Promise(function(resolve,reject) {
				var queryCriteria = [];
				var options = {};
				if(queryParams.beginDatum && queryParams.beginDatum !== "undefined") {
					queryCriteria.push({datum: {$gte:queryParams.beginDatum}});
				}
				if(queryParams.eindDatum && queryParams.eindDatum !== "undefined") {
					queryCriteria.push({datum: {$lte:queryParams.eindDatum}});
				}
				if(queryParams.datum && queryParams.datum !== "undefined") {
					queryCriteria.push({datum: queryParams.datum});
				}
				if(queryParams.info && queryParams.info !== "undefined") {
					queryCriteria.push({info: queryParams.info});
				}
				if(queryParams.mededeling && queryParams.mededeling !== "undefined") {
					queryCriteria.push({mededeling: queryParams.mededeling});
				}
				if(queryParams.bedrag && queryParams.bedrag !== "undefined") {
					queryCriteria.push({bedrag: queryParams.bedrag});
				}
				if(queryParams.minBedrag && queryParams.minBedrag !== "undefined") {
					queryCriteria.push({bedrag: {$gte:queryParams.minBedrag}});
				}
				if(queryParams.maxBedrag && queryParams.maxBedrag !== "undefined") {
					queryCriteria.push({bedrag: {$lte:queryParams.maxBedrag}});
				}
				if(queryParams.bank && queryParams.bank !== "undefined") {
					queryCriteria.push({bank: {$eq:queryParams.bank}});
				}
				if(queryParams.csum && queryParams.csum !== "undefined") {
					queryCriteria.push({csum: queryParams.csum});
				}
				if(queryParams.status && queryParams.status !== "undefined") {
					queryCriteria.push({status: {$eq:queryParams.status}});
				}
				if(queryParams.categorie && queryParams.categorie !== "undefined") {
					if(queryParams.categorie === "empty") {
							queryCriteria.push({categorie: ""});
					} else {
							queryCriteria.push({categorie: queryParams.categorie});
					}
				}
				if(queryParams.businessRuleClassification && queryParams.businessRuleClassification !== "false") {
					queryCriteria.push({categorieGuessedByBusinessRule: {$exists:true} });
				}
				if(queryParams.periodiciteit && queryParams.periodiciteit !== "undefined") {
					queryCriteria.push({periodiciteit: queryParams.periodiciteit });
				}
				if(queryParams.manualLabel && queryParams.manualLabel !== "undefined") {
					queryCriteria.push({manualLabel: queryParams.manualLabel });
				}

				var queryObject = {};
				if(queryCriteria.length > 0) {
					queryObject.$and = queryCriteria;
				}

				var query = VerrichtingModel
					.find(queryObject);

				if(queryParams.limit && queryParams.limit !== "undefined") {
					query = query.limit(queryParams.limit);
				}
				if(queryParams.skip && queryParams.skip !== "undefined") {
					query = query.skip(queryParams.skip);
				}

				var sortParam = { datum: 'desc' };
				if(queryParams.sortField === "datum_up") {
					sortParam = { datum: 'asc' };
				}
				if(queryParams.sortField === "datum_down") {
					sortParam = { datum: 'desc' };
				}
				if(queryParams.sortField === "bedrag_up") {
					sortParam = { bedrag: 'asc' };
				}
				if(queryParams.sortField === "bedrag_down") {
					sortParam = { bedrag: 'desc' };
				}

				query = query
					.sort(sortParam);

				query.exec(function(err,results) {
					if(err) {
						reject(err);
					} else {
						VerrichtingModel.count(queryObject, function(err, count) {
							if(err) {
								reject(err);
							} else {
								var response = {};
								response.results = results;
								response.count = count;
								resolve(response);
							}
						});
					}
				});
			});
	}

	function findLastVerrichtingForBank(bank) {
		console.log("DA", bank);
		return new Promise(function(resolve,reject) {
			VerrichtingModel
				.findOne({ bank: bank })
				.sort({datum: 'desc'})
				.exec(function(err,result) {
					if(err) {
						reject(err);
					} else {
						console.log("Verrichting DA RETURNING");
						resolve(result);
					}
				});
		});
	}

	function save(verrichting) {
		return new Promise(function(resolve,reject) {
			VerrichtingModel.findOne({ verrichtingId: verrichting.verrichtingId }).exec(function(err,doc) {
				if(err) {
					reject(err);
					return;
				}
				if(doc) {
					resolve(doc);
				} else {
					var verrichtingModel = new VerrichtingModel({});
					resolve(verrichtingModel);
				}
			});
		})
		.then(function(verrichtingModel) {
			return new Promise(function(resolve,reject) {
				verrichtingModel.verrichtingId = verrichting.verrichtingId;
				verrichtingModel.bankRef = verrichting.bankRef;
				verrichtingModel.datum = verrichting.datum;
				verrichtingModel.bedrag = verrichting.bedrag;
				verrichtingModel.rekeningTegenpartij = verrichting.rekeningTegenpartij;
				verrichtingModel.valuta = verrichting.valuta;
				verrichtingModel.naamTegenpartij = verrichting.naamTegenpartij;
				verrichtingModel.type = verrichting.type;
				verrichtingModel.mededeling = verrichting.mededeling;
				verrichtingModel.info = verrichting.info;
				verrichtingModel.bank = verrichting.bank;
				verrichtingModel.status = verrichting.status;
				verrichtingModel.csum = verrichting.csum;
				verrichtingModel.categorie = verrichting.categorie;
				verrichtingModel.datumDisplay = verrichting.datumDisplay;
				verrichtingModel.periodiciteit = verrichting.periodiciteit;
				verrichtingModel.manualLabel = verrichting.manualLabel;
				verrichtingModel.recurringYearly = verrichting.recurringYearly;
				verrichtingModel.recurringMonthly = verrichting.recurringMonthly;


				verrichtingModel.save(function (err) {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
		});
	}

	function getTimeExtremes() {
		return Promise.all([getMinTime(),getMaxTime()]);
	}

	function getMinTime() {
		return new Promise(function(resolve,reject) {
			VerrichtingModel
				.aggregate([{
					$group: { _id: "minDate", minDate: { $min: "$datum" } }
				}])
				.exec(function(err,doc) {
					console.log(err,doc);
					if(err) {
						return reject(err);
					}
					resolve(doc[0]);
				});
		});
	}

	function getMaxTime() {
		return new Promise(function(resolve,reject) {
			VerrichtingModel
				.aggregate([{
					$group: { _id: "maxDate", maxDate: { $max: "$datum" } }
				}])
				.exec(function(err,doc) {
					console.log(err,doc);
					if(err) {
						return reject(err);
					}
					resolve(doc[0]);
				});
		});
	}

	return {
		save: save,
		get: get,
		getAll: getAll,
		removeAll: removeAll,
		removeBulk: removeBulk,
		remove: remove,
		search: search,
		findLastVerrichtingForBank: findLastVerrichtingForBank,
		getTimeExtremes: getTimeExtremes
	};
};

module.exports = new VerrichtingDA();
