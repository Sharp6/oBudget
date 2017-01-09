var classifier = function() {
	var businessRules = require('./businessRules');

	function classify(verrichting) {
		return businessRules.then(function(rules) {
			var classification = "Classification by business rule failed";
			rules.forEach(function(businessRule) {
				var attempt = businessRule.execute(verrichting);
				if(attempt) {
					//console.log("BRC: Go match for", attempt, "based on", businessRule.indicatorString);
					classification = attempt;
				}
			});
			return classification;
		});
	}

	return {
		classify: classify
	};
};

module.exports = new classifier();