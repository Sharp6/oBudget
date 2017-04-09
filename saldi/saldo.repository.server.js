var Saldo = require('./saldo.model.server');
var saldoDA = require('./saldo.da.server');

var verrichtingRepo = require('./../verrichtingen/verrichting.repository.server');

var uuid = require('uuid');

var saldoRepo = function() {
	var _saldi = [];

	function create(data) {
		return Promise.resolve()
			.then(function() {
				var augmentedData = {};
		    	for (var dataAttribute in data) { augmentedData[dataAttribute] = data[dataAttribute]; }
				augmentedData.saldoId = uuid.v4();

				var newSaldo = new Saldo(augmentedData);
				return newSaldo;
			})
			.then(augmentWithVerrichting)
			.then(saldo => {
				_saldi.push(saldo);
				return saldo;
			});
	}

	function getAll() {
		return saldoDA.getAll()
			.then(function(saldiData) {
				var promises = saldiData.map(function(saldoData) {
					return getSaldoByData(saldoData);
				});
				return Promise.all(promises);
			});
	}

	function getSaldoByData(saldoData) {
		return new Promise(function(resolve,reject) {
			var saldo = _saldi.find(function(saldo) {
				return saldo.saldoId === saldoData.saldoId;
			});
			if(saldo) {
				resolve(saldo);
			} else {
				var newSaldo = new Saldo(saldoData);
				augmentWithVerrichting(newSaldo)
					.then(saldo => {
						_saldi.push(saldo);
						resolve(saldo);
					});
			}
		});
	}

	function getSaldoById(saldoId) {
		return new Promise(function(resolve,reject) {
			var saldo = _saldi.find(function(saldo) {
				return saldo.saldoId === saldoId;
			});
			if(saldo) {
				resolve(saldo);
			} else {
				// retrieve from db
				saldoDA.get(saldoId)
					.then(function(saldoData) {
						var newSaldo = new Saldo(saldoData);
						return newSaldo;
					})
					.then(augmentWithVerrichting)
					.then(saldo => {
						_saldi.push(saldo);
						resolve(saldo);
					})
					.catch(function(err) {
						reject(err);
					});
			}
		});
	}

	function augmentWithVerrichting(saldo) {
		
		return verrichtingRepo
			.getVerrichtingById(saldo.laatsteVerrichtingId)
			.then(verrichting => {
				saldo.laatsteVerrichting = verrichting;
				return saldo;
			});
		
		//return Promise.resolve(saldo);
	}

	function save(saldo) {
		return saldoDA.save(saldo)
			.then(function() {
				return saldo;
			});
	}

	return {
		create: create,
		getAll: getAll,
		getSaldoById: getSaldoById,
		save: save
	};
};

module.exports = new saldoRepo();
