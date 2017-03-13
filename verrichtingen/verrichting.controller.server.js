var verrichtingRepo = require('./verrichting.repository.server');
var moment = require('moment');

var verrichtingCtrl = function() {
	// API ===============================================================
	function getAll(req,res) {
		return verrichtingRepo.getAll()
			.then(function(verrichtingen) {
				res.send(verrichtingen);
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	}

	function search(req,res) {
		req.query.beginDatum = moment(req.query.beginDatum || "18/04/1983", "DD/MM/YYYY");
		req.query.eindDatum = moment(req.query.eindDatum || "31/12/2019", "DD/MM/YYYY");
		return verrichtingRepo.search(req.query)
			.then(function(response) {
				res.send(response);
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	}

	function getMultiple(req,res) {
		if(req.query) {
			return search(req,res);
		} else {
			return getAll(req,res);
		}
	}

	/*
	This is probably not needed for verrichting
	var create = function(req,res) {
		categorieRepo.create(req.body)
			.then(function(categorie){
				return getAll(req,res);
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};
	*/

	var update = function(req,res) {

	};

	var get = function(req,res) {
		return verrichtingRepo.getVerrichtingById(req.params.id)
			.then(function(verrichting) {
				return res.send(verrichting);
			})
			.catch(function(err) {
				return res.status(500).send(err);
			});
	};

	var checkDuplicates = function(req,res) {
		return verrichtingRepo.handleDuplicates(req.params.csum)
			.then(function(message) {
				res.send(message);
			});
	};

	var checkAllDuplicates = function(req,res) {
		return verrichtingRepo.getAll()
			.then(function(verrichtingen) {
				var promise = Promise.resolve();
				verrichtingen.forEach(function(verrichting) {
					promise = promise.then(function() {
						return verrichtingRepo.handleDuplicates(verrichting.csum);
					});
				});
				return promise;
			})
			.then(function() {
				res.send("All verrichtingen checked for duplicates.");
			});
	};

	// Renderers ==========================================================
	var renderAll = function(req,res) {
		return verrichtingRepo.getAll()
			.then(function(verrichtingen) {
				return res.render('verrichtingen/verrichtingen', {
					verrichtingen: verrichtingen,
					sorters: [
						{ sorterValue: 'datum_up', sorterLabel: 'Datum oplopend' },
						{ sorterValue: 'datum_down', sorterLabel: 'Datum aflopend' },
						{ sorterValue: 'bedrag_up', sorterLabel: 'Bedrag oplopend' },
						{ sorterValue: 'bedrag_down', sorterLabel: 'Bedrag aflopend' }
					]
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var renderSearch = function(req,res) {
		req.query.beginDatum = moment(req.query.beginDatum || "18/04/1983", "DD/MM/YYYY");
		req.query.eindDatum = moment(req.query.eindDatum || "31/12/2019", "DD/MM/YYYY");
		req.query.beginDatumDisplay = req.query.beginDatum.format("DD/MM/YYYY");
		req.query.eindDatumDisplay = req.query.eindDatum.format("DD/MM/YYYY");

		return verrichtingRepo.search(req.query)
			.then(function(response) {
				return res.render('verrichtingen/verrichtingen', {
					verrichtingen: response.verrichtingen,
					searchParams: req.query,
					sorters: [
						{ sorterValue: 'datum_up', sorterLabel: 'Datum oplopend' },
						{ sorterValue: 'datum_down', sorterLabel: 'Datum aflopend' },
						{ sorterValue: 'bedrag_up', sorterLabel: 'Bedrag oplopend' },
						{ sorterValue: 'bedrag_down', sorterLabel: 'Bedrag aflopend' }
					]
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var renderVerrichting = function(req,res) {
		return verrichtingRepo.getVerrichtingById(req.params.id)
			.then(function(verrichting) {
				res.render('verrichtingen/verrichting', {
					verrichting: verrichting
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var renderHelpers = function(req,res) {
		res.render('verrichtingen/helpers');
	};

	var editFormSubmit = function(req,res) {
		return verrichtingRepo.getVerrichtingById(req.params.id)
			.then(function(verrichting) {
				verrichting.categorie = req.body.categorie;
				verrichting.periodiciteit = req.body.periodiciteit;
				verrichting.manualLabel = req.body.manualLabel;
				verrichting.recurringYearly = req.body.recurringYearly;
				verrichting.recurringMonthly = req.body.recurringMonthly;

				// This should not happen in the controller... REFACTOR
				verrichting.datum = moment.tz(req.body.datumDisplay, "DD-MM-YYYY", "Europe/Brussels");
				verrichting.datumDisplay = verrichting.datum.format("DD/MM/YYYY");
				return verrichting;
			})
			.then(verrichtingRepo.save)
			.then(function(verrichting) {
				res.render('verrichtingen/verrichting', {
					verrichting: verrichting
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var getTimeExtremes = function(req,res) {
		console.log("CONTROLLOR");
		verrichtingRepo.getTimeExtremes()
			.then(function(result) {
				res.status(200).json(result);
			})
			.catch(function(err) {
				console.log(err);
				res.status(500).send(err);

			});
	}

	return {
		getAll: getAll,
		get: get,
		renderAll: renderAll,
		renderSearch: renderSearch,
		renderVerrichting: renderVerrichting,
		checkDuplicates: checkDuplicates,
		checkAllDuplicates: checkAllDuplicates,
		renderHelpers: renderHelpers,
		editFormSubmit: editFormSubmit,
		getMultiple: getMultiple,
		getTimeExtremes: getTimeExtremes
	};
};

module.exports = new verrichtingCtrl();
