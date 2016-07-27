var businessRules = [
	["DELH_", "Dagelijkse kosten"]
].map(function(businessRule) {
	return {
		indicatorString: businessRule[0],
		categoryName: businessRule[1],
		execute: function(verrichting) {
			if(verrichting.info.indexOf(this.indicatorString) !== -1) {
				return this.categoryName;
			} else {
				return;
			}
		}
	};
});

module.exports = businessRules;