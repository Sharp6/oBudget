var bankRepo = require('./bank.repository.server');

var bankCtrl = function() {

	// API 
	var getAll = function(req,res) {
		return bankRepo.getAll()
			.then(function(banken) {
				res.send(banken);
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var create = function(req,res) {
		bankRepo.create(req.body)
			.then(function(bank){
				return getAll(req,res);
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var update = function(req,res) {

	};

	var get = function(req,res) {
		return bankRepo.getBankByNaam(req.params.id)
			.then(function(bank) {
				return res.send(bank);
			})
			.catch(function(err) {
				return res.status(500).send(err);
			});
	};

	// Renderers
	var renderAll = function(req,res) {
		return bankRepo.getAll()
			.then(function(banken) {
				console.log("BANKCONTROLLER: Rendering all!");
				return res.render('banken/banken', {
					banken: banken
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var renderForm = function(req,res) {
		return res.render('banken/createBankForm');
	};

	var renderUpdateForm = function(req,res) {
		return bankRepo.getBankByNaam(req.params.id)
			.then(function(bank) {
				return res.render('banken/editBankForm', {
					bank: bank
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var renderBank = function(req,res) {
		return bankRepo.getBankByNaam(req.params.id)
			.then(function(bank) {
				res.render('banken/bank', {
					bank: bank
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var createFormSubmit = function(req,res) {
		return bankRepo.create(req.body)
			.then(bankRepo.save)
			.then(function(bank) {
				res.render('banken/bank', {
					bank: bank
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var editFormSubmit = function(req,res) {
		return bankRepo.getBankByNaam(req.params.id)
			.then(function(bank) {
				bank.startSaldo = req.body.startSaldo;
				return bank;
			})
			.then(bankRepo.save)
			.then(function(bank) {
				res.render('banken/bank', {
					bank: bank
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
		renderBank: renderBank,
		createFormSubmit: createFormSubmit,
		editFormSubmit: editFormSubmit
	};
};

module.exports = new bankCtrl();