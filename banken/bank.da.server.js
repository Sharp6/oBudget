var mongoose = require('mongoose');

var BankDA = function() {
	var bankSchema = new mongoose.Schema({
		naam: String,
		startSaldo: Number
	});

	var BankModel = mongoose.model('Bank', bankSchema);

	function getAll() {
		return new Promise(function(resolve,reject) {
			BankModel.find().exec(function(err, doc) {
				if(err) {
					return reject(err);
				} else {
					resolve(doc);
				}
			});
		});
	}

	function get(naam) {
		return new Promise(function(resolve,reject) {
			BankModel.find({naam: naam}, function(err,result) {
				if(err) {
					return reject(err);
				} else {
					resolve(result[0]);
				}
			});
		});
	}

	function removeAll() {
		return new Promise(function(resolve,reject) {
			BankModel.remove({}, function(err,result) {
				if(err) {
					return reject(err);
				}
				return resolve(result);
			});
		});
	}

	function remove(bank) {
		return new Promise(function(resolve,reject) {
			BankModel.remove({ naam: bank.naam }, function(err,result) {
				if(err) {
					return reject(err);
				}
				return resolve(result);
			});
		});
	}

	function save(bank) {
		return new Promise(function(resolve,reject) {
			BankModel.findOne({ naam: bank.naam }).exec(function(err,doc) {
				if(err) {
					reject(err);
					return;
				}
				if(doc) {
					resolve(doc);
				} else {
					var bankModel = new BankModel({});
					resolve(bankModel);
				}
			});
		})
		.then(function(bankModel) {
			return new Promise(function(resolve,reject) {
				bankModel.naam = bank.naam;
				bankModel.startSaldo = bank.startSaldo;
				
				bankModel.save(function (err) {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
		});
	}

	return {
		save: save,
		get: get,
		getAll: getAll,
		removeAll: removeAll,
		remove: remove
	};
};

module.exports = new BankDA();