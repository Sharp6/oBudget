var verrichtingRepo = require('../verrichtingen/verrichting.repository.server');
var verrichtingCtrl = require('../verrichtingen/verrichting.controller.server');

var bulkClassifier = function() {
	function classify(req,res) {
		verrichtingRepo.getAll()
			.then(function(verrichtingen) {
				var promise = Promise.resolve();
				verrichtingen.forEach(function(verrichting) {
					if(verrichting.categorie === '' && verrichting.categoryByBusinessRuleClassifier !== "Classification by business rule failed") {
						verrichting.categorie = verrichting.categoryByBusinessRuleClassifier;
						promise = promise.then(function() {
							return verrichtingRepo.save(verrichting);
						});
					}
				});
				return promise;
			})
			.then(function() {
				return verrichtingCtrl.renderAll(req,res);
			});
	}

	return {
		classify: classify
	};
};

module.exports = new bulkClassifier();