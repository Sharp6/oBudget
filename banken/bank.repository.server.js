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
				console.log("BANKREPO", "_instantiateBank", bank.naam);
				return verrichtingRepo.findLastVerrichtingForBank(bank.naam)
					.then(function(laatsteVerrichting) {
						console.log("BANKREPO", "Got laatsteVerrichting", bank.naam);
						bank.datumLaatsteVerrichting = laatsteVerrichting.datum;
					})
					.then(function() {
						console.log("BANKREPO: Getting all verrichtingen for", bank.naam);
						return verrichtingRepo.findVerrichtingenForBank(bank.naam);
					})
					.then(function(verrichtingen) {
						console.log("BANKREPO: Calculating lopendSaldo for", bank.naam);
						bank.lopendSaldo = verrichtingen.reduce(function(subtotaal, verrichting) {
							return subtotaal + verrichting.bedrag;
						}, 0);
						bank.huidigBerekendSaldo = bank.startSaldo + bank.lopendSaldo;
						return;
					})
					.then(function(){
						_banken.push(bank);
						console.log("BANKREPO: returning", bank.naam);
						return bank;
					});
			})
			.then(function(bank) {
				console.log("BANKREPO: returning to getAll", bank.naam);
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
				console.log("BANKREPO PROMISES", promises);
				return Promise.all(promises);
			});
	}

	function getBankByData(bankData) {
		var bank = _banken.find(function(bank) {
			return bank.naam === bankData.naam;
		});
		if(bank) {
			console.log("BANKREP: found bank in cache", bank.naam);
			return Promise.resolve(bank);
		} else {
			console.log("BANKREP: instantiating bank", bankData.naam);
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
					.then(function(bankData) {
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