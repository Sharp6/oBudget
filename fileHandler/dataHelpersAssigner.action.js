function assignDataHelpers(fileToParse) {
	return new Promise(function(resolve,reject) {
		var dataPreparers = {
			argenta: require("./dataPreparer.argenta.action"),
			belfius: require("./dataPreparer.belfius.action"),
			kbc: require("./dataPreparer.kbc.action"),
			visa: require("./dataPreparer.kbc.action")
		};

		var dataParsers = {
			argenta: require("./dataParser.csv.action"),
			belfius: require("./dataParser.csv.action"),
			kbc: require("./dataParser.csv.action"),
			visa: require("./dataParser.scraper.action")
		};

		var dataMappers = {
			argenta: require("./dataMapper.argenta.action"),
			belfius: require("./dataMapper.belfius.action"),
			kbc: require("./dataMapper.kbc.action"),
			visa: require("./dataMapper.visa.action")
		};

		if(dataPreparers[fileToParse.bank] && dataMappers[fileToParse.bank] && dataParsers[fileToParse.bank]) {
			fileToParse.dataPreparer = dataPreparers[fileToParse.bank];
			fileToParse.dataMapper = dataMappers[fileToParse.bank];
			fileToParse.dataParser = dataParsers[fileToParse.bank];
			resolve(fileToParse);
		} else {
			reject("No data preparer or mapper found");
		}
	});
}

module.exports = assignDataHelpers;