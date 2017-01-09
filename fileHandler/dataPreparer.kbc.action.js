function prepareKbcFile(fileToParse) {
	return new Promise(function(resolve,reject) {
		fileToParse.preparedData = fileToParse.rawData;
		resolve(fileToParse);
	});
}

module.exports = prepareKbcFile;