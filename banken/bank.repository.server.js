"use strict";

var Bank = require('./bank.model.server');
var bankDA = require('./bank.da.server');

var verrichtingRepo = require('./../verrichtingen/verrichting.repository.server');

var bankRepo = function() {
	var _banken = [];

	function _instantiateBank(data) {
		return Promise.resolve()
			.then(function() {
				var bank = new Bank(data);
				return verrichtingRepo.findLastVerrichtingForBank(bank.naam)
					.then(function(laatsteVerrichting) {
						bank.datumLaatsteVerrichting = laatsteVerrichting.datum;
					})
					.then(function() {
						return verrichtingRepo.findVerrichtingenForBank(bank.naam);
					})
					.then(function(verrichtingen) {
						bank.lopendSaldo = verrichtingen.reduce(function(subtotaal, verrichting) {
							return subtotaal + verrichting.bedrag;
						}, 0);
						bank.huidigBerekendSaldo = bank.startSaldo + bank.lopendSaldo;
						return;
					})
					.then(function(){
						_banken.push(bank);
						return bank;
					});
			})
			.then(function(bank) {
				return bank;
			});
	}

	function create(data) {
		return Promise.resolve()
			.then(function() {
				var newBank = new Bank(data);
				_banken.push(newBank);
				return newBank;
			});
	}

	function getAll() {
		return bankDA.getAll()
			.then(function(bankenData) {
				var promises = bankenData.map(function(bankData) {
					return getBankByData(bankData);
				});
				return Promise.all(promises);
			});
	}

	function getBankByData(bankData) {
		var bank = _banken.find(function(bank) {
			return bank.naam === bankData.naam;
		});
		if(bank) {
			return Promise.resolve(bank);
		} else {
			return _instantiateBank(bankData);
		}
	}

	function getBankByNaam(naam) {
		return new Promise(function(resolve,reject) {
			var bank = _banken.find(function(bank) {
				return bank.naam === naam;
			});
			if(bank) {
				resolve(bank);
			} else {
				// retrieve from db
				bankDA.get(naam)
					.then(getBankByData)
					.then(bank => {
						resolve(bank);
					})
					.catch(function(err) {
						reject(err);
					});
			}
		});
	}

	function save(bank) {
		return bankDA.save(bank)
			.then(function() {
				return bank;
			});
	}

	return {
		create: create,
		getAll: getAll,
		getBankByNaam: getBankByNaam,
		save: save
	};
};

module.exports = new bankRepo();