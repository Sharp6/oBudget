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
					console.log("HERE", err);
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

	function checkSaldoFlow(saldoId) {
		var saldoCheck = {
			saldoId: saldoId
		};

		return _getSaldo(saldoCheck)
			.then(_getVerrichtingen)
			.then(_getBeginSaldo)
			.then(_doCheck);
	}
	
	function checkSaldo(req,res) {
		_checkSaldoFlow(req.body.saldoId)
			.then(function(saldoCheck) {
				res.send(saldoCheck);
			})
			.catch(function(err) {
				res.send(err);
			});
	}

	return {
		checkSaldo: checkSaldo,
		checkSaldoFlow: checkSaldoFlow
	};
};

module.exports = new saldoCheckerCtrl();
