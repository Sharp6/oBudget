var verrichtingRepo = require('./verrichting.repository.server');

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
				console.log("VERRICHTINGENCTRL: verrichtingen", verrichtingen);
				return res.render('verrichtingen/verrichtingen', {
					verrichtingen: verrichtingen
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

	return {
		getAll: getAll,
		get: get,
		renderAll: renderAll,
		renderVerrichting: renderVerrichting,
		checkDuplicates: checkDuplicates,
		checkAllDuplicates: checkAllDuplicates,
		renderHelpers: renderHelpers,
		editFormSubmit: editFormSubmit
	};
};

module.exports = new verrichtingCtrl();
