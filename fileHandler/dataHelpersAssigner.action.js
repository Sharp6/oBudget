function assignDataHelpers(fileToParse) {
	return new Promise(function(resolve,reject) {
		var dataPreparers = {
			argenta: require("./dataPreparer.argenta.action"),
			belfius: require("./dataPreparer.belfius.action")
		};

		var dataMappers = {
			argenta: require("./dataMapper.argenta.action")
		};

		if(dataPreparers[fileToParse.bank] && dataMappers[fileToParse.bank]) {
			fileToParse.dataPreparer = dataPreparers[fileToParse.bank];
			fileToParse.dataMapper = dataMappers[fileToParse.bank];
			resolve(fileToParse);
		} else {
			reject("No data preparer or mapper found");
		}
	});
}

module.exports = assignDataHelpers;