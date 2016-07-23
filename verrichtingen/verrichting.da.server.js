var mongoose = require('mongoose');

var VerrichtingDA = function() {
	var verrichtingSchema = new mongoose.Schema({
		verrichtingId: String,
		bankRef: String,
		datum: Date,
		bedrag: Number,
		rekeningTegenpartij: String,
		valuta: String,
		naamTegenpartij: String,
		type: String,
		mededeling: String,
		info: String,
		bank: String,
		status: String
	});

	var VerrichtingModel = mongoose.model('Verrichting', verrichtingSchema);

	function getAll() {
		return new Promise(function(resolve,reject) {
			VerrichtingModel.find().exec(function(err,doc) {
				if(err) {
					reject(err);
				} else {
					console.log("DA:", doc);
					resolve(doc);
				}
			});
		});
	}

	function deleteAll() {
		return new Promise(function(resolve,reject) {
			VerrichtingModel.remove({}, function(err,result) {
				if(err) {
					return reject(err);
				}
				console.log("DA: DELETED");
				return resolve(result);
			});
		});
	}

	function save(verrichting) {
		return new Promise(function(resolve,reject) {
			VerrichtingModel.findOne({ verrichtingId: verrichting.verrichtingId }).exec(function(err,doc) {
				if(err) {
					reject(err);
					return;
				}
				if(doc) {
					console.log("VERRICHTINGDA: DOC FOUND, AN UPDATE SHOULD HAPPEN");
					resolve();
				} else {
					console.log("DA: I'M SAVING");
					var verrichtingModel = new VerrichtingModel({
						verrichtingId: verrichting.verrichtingId,
						bankRef: verrichting.bankRef,
						datum: verrichting.datum,
						bedrag: verrichting.bedrag,
						rekeningTegenpartij: verrichting.rekeningTegenpartij,
						valuta: verrichting.valuta,
						naamTegenpartij: verrichting.naamTegenpartij,
						type: verrichting.type,
						mededeling: verrichting.mededeling,
						info: verrichting.info,
						bank: verrichting.bank,
						status: verrichting.status
					});

					verrichtingModel.save(function (err) {
						if (err) {
							reject(err);
						} else {
							console.log("DA: I'M DONE SAVING");
							resolve();
						}
					});
				}
			});
		});
	}

	return {
		save: save,
		getAll: getAll,
		deleteAll: deleteAll
	};
};


module.exports = new VerrichtingDA();