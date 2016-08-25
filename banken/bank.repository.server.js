var Bank = require('./bank.model.server');
var bankDA = require('./bank.da.server');

var bankRepo = function() {
	var _banken = [];

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
		return new Promise(function(resolve,reject) {
			var bank = _banken.find(function(bank) {
				return bank.naam === bankData.naam;
			});
			if(bank) {
				resolve(bank);
			} else {
				var newBank = new Bank(bankData);
				_banken.push(newBank);
				resolve(newBank);
			}
		});
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
						var newBank = new Bank(bankData);
						_banken.push(newBank);
						resolve(newBank);
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