

function loadBusinessRules() {
	return require('./businessRules');
}

function classify(verrichting) {
	var businessRules = loadBusinessRules();
	var classification;
	businessRules.forEach(function(businessRule) {
		var attempt = businessRule.execute(verrichting);
		if(attempt) {
			classification = attempt;
		}
	});
	return classification;
}


module.exports = {
	loadBusinessRules: loadBusinessRules,
	classify: classify
};