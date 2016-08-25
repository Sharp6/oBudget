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

	// Renderers ==========================================================
	var renderAll = function(req,res) {
		return verrichtingRepo.getAll()
			.then(function(verrichtingen) {
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

	return {
		getAll: getAll,
		get: get,
		renderAll: renderAll, 
		renderVerrichting: renderVerrichting
	};
};

module.exports = new verrichtingCtrl();
