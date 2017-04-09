var saldoRepo = require('../saldi/saldo.repository.server');
var verrichtingRepo = require('../verrichtingen/verrichting.repository.server');
var bankRepo = require('../banken/bank.repository.server');

var saldoChecker = require('./saldoChecker');

var saldoCheckerCtrl = function() {

	function _getVerrichtingen(saldoCheck) {
		// Get laatsteVerrichting
		// Get datum laatste verrichting
		// get Verrichtingen voor laatste verrichting
		return new Promise(function(resolve,reject) {
			verrichtingRepo.getVerrichtingById(saldoCheck.saldo.laatsteVerrichtingId)
				.then(function(laatsteVerrichting) {
					return verrichtingRepo.findVerrichtingenForBankBefore(laatsteVerrichting.bank, laatsteVerrichting.datum);
				}, function(err) {
					reject(err);
				})
				.then(function(verrichtingen) {
					saldoCheck.verrichtingen = verrichtingen;
					resolve(saldoCheck);
				})
				.catch(function(err) {
					reject("Err in saldoCheckerCtrl _getVerrichtingen: " + err);
				});
		});
	}

	function _getSaldo(saldoCheck) {
		return new Promise(function(resolve,reject) {
			saldoRepo.getSaldoById(saldoCheck.saldoId)
				.then(function(saldo) {
					saldoCheck.saldo = saldo;
					resolve(saldoCheck);
				})
				.catch(function(err) {
					reject("Err in saldoCheckerCtrl _getSaldo: " + err);
				});
		});
	}

	function _getBeginSaldo(saldoCheck) {
		return new Promise(function(resolve,reject) {
			bankRepo.getBankByNaam(saldoCheck.saldo.bankNaam)
				.then(function(bank) {
					saldoCheck.beginSaldo = bank.startSaldo;
					resolve(saldoCheck);
				})
				.catch(function(err) {
					reject("Err in saldoCheckerCtrl _getBeginSaldo: " + err);
				});
		});
	}

	function _doCheck(saldoCheck) {
		return new Promise(function(resolve,reject) {
			saldoCheck.checkResult = saldoChecker(saldoCheck.saldo.bedrag, saldoCheck.verrichtingen, saldoCheck.beginSaldo);
			resolve(saldoCheck);
		});
	}

	function _checkSaldoFlow(saldoId) {
		var saldoCheck = {
			saldoId: saldoId
		};

		var result = _getSaldo(saldoCheck)
			.then(_getVerrichtingen)
			.then(_getBeginSaldo)
			.then(_doCheck);

		return result;
	}
	
	function checkSaldo(req,res) {
		_checkSaldoFlow(req.params.saldoId)
			.then(function(saldoCheck) {
				res.send(saldoCheck);
			})
			.catch(function(err) {
				res.send(err);
			});
	}

	function renderSaldoFlow(req,res) {
		_checkSaldoFlow(req.params.saldoId)
			.then(function(saldoCheck) {
				res.render('saldoChecker/check', {
					saldoCheck: saldoCheck
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	}

	function renderSaldoCheckerMain(req,res) {
		saldoRepo.getAll()
			.then(function(saldi) {
				res.render('saldoChecker/main', {
					saldi: saldi
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	}

	return {
		checkSaldo: checkSaldo,
		checkSaldoFlow: _checkSaldoFlow,
		renderSaldoFlow: renderSaldoFlow,
		renderSaldoCheckerMain: renderSaldoCheckerMain
	};
};

module.exports = new saldoCheckerCtrl();
