var saldoRepo = require('./saldo.repository.server');

var saldoCtrl = function() {

	// API 
	var getAll = function(req,res) {
		return saldoRepo.getAll()
			.then(function(saldi) {
				res.send(saldi);
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var create = function(req,res) {
		saldoRepo.create(req.body)
			.then(function(saldo){
				return getAll(req,res);
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var update = function(req,res) {

	};

	var get = function(req,res) {
		return saldoRepo.getSaldoById(req.params.id)
			.then(function(saldo) {
				return res.send(saldo);
			})
			.catch(function(err) {
				return res.status(500).send(err);
			});
	};

	// Renderers
	var renderAll = function(req,res) {
		return saldoRepo.getAll()
			.then(function(saldi) {
				return res.render('saldi/saldi', {
					saldi: saldi
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var renderForm = function(req,res) {
		return res.render('saldi/createSaldoForm');
	};

	var renderUpdateForm = function(req,res) {
		return saldoRepo.getSaldoById(req.params.id)
			.then(function(saldo) {
				return res.render('saldi/editSaldoForm', {
					saldo: saldo
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var renderSaldo = function(req,res) {
		return saldoRepo.getSaldoById(req.params.id)
			.then(function(saldo) {
				res.render('saldi/saldo', {
					saldo: saldo
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var createFormSubmit = function(req,res) {
		return saldoRepo.create(req.body)
			.then(saldoRepo.save)
			.then(function(saldo) {
				res.render('saldi/saldo', {
					saldo: saldo
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var editFormSubmit = function(req,res) {
		return saldoRepo.getSaldoById(req.params.id)
			.then(function(saldo) {
				saldo.bedrag = req.body.bedrag;
				saldo.laatsteVerrichtingId = req.body.laatsteVerrichtingId;
				saldo.bankNaam = req.body.bankNaam;
				return saldo;
			})
			.then(saldoRepo.save)
			.then(function(saldo) {
				res.render('saldi/saldo', {
					saldo: saldo
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	return {
		getAll: getAll,
		create: create,
		get: get,
		update: update,
		renderAll: renderAll,
		renderForm: renderForm,
		renderUpdateForm: renderUpdateForm,
		renderSaldo: renderSaldo,
		createFormSubmit: createFormSubmit,
		editFormSubmit: editFormSubmit
	};
};

module.exports = new saldoCtrl();