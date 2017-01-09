var fileReader = require('../../../fileHandler/fileReader.action');
var dataParser = require('../../../fileHandler/dataParser.csv.action');

var fileToParse = {
	filename: "./classifier/businessRuleClassifier/businessRules/rules.csv"
};

var businessRules = fileReader(fileToParse)
	.then(function(fileToParse) {
		fileToParse.preparedData = fileToParse.rawData;
		return fileToParse;
	})
	.then(dataParser)
	.then(function(fileToParse) {
		return fileToParse.dataArray.map(function(rule) {
			rule.execute = function(verrichting) {
				if(verrichting.info.indexOf(this.indicatorString.toString()) !== -1) {
					return this.categoryName;
				} else {
					return;
				}
			};
			return rule;
		});
	});
	
module.exports = businessRules;