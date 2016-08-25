var mongoose = require('mongoose');

var saldoDA = function() {
	var saldoSchema = new mongoose.Schema({
		saldoId: String,
		bedrag: Number,
		bankNaam: String,
		laatsteVerrichtingId: String
	});

	var SaldoModel = mongoose.model('Saldo', saldoSchema);

	function getAll() {
		return new Promise(function(resolve,reject) {
			SaldoModel.find().exec(function(err, doc) {
				if(err) {
					return reject(err);
				} else {
					resolve(doc);
				}
			});
		});
	}

	function get(saldoId) {
		return new Promise(function(resolve,reject) {
			SaldoModel.find({saldoId: saldoId}, function(err,result) {
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
			SaldoModel.remove({}, function(err,result) {
				if(err) {
					return reject(err);
				}
				return resolve(result);
			});
		});
	}

	function remove(saldo) {
		return new Promise(function(resolve,reject) {
			SaldoModel.remove({ saldoId: saldo.saldoId }, function(err,result) {
				if(err) {
					return reject(err);
				}
				return resolve(result);
			});
		});
	}

	function save(saldo) {
		return new Promise(function(resolve,reject) {
			SaldoModel.findOne({ saldoId: saldo.saldoId }).exec(function(err,doc) {
				if(err) {
					reject(err);
					return;
				}
				if(doc) {
					resolve(doc);
				} else {
					var saldoModel = new SaldoModel({});
					resolve(saldoModel);
				}
			});
		})
		.then(function(saldoModel) {
			return new Promise(function(resolve,reject) {
				saldoModel.saldoId = saldo.saldoId;
				saldoModel.bankNaam = saldo.bankNaam;
				saldoModel.laatsteVerrichtingId = saldo.laatsteVerrichtingId;
				saldoModel.bedrag = saldo.bedrag;
				
				saldoModel.save(function (err) {
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

module.exports = new saldoDA();