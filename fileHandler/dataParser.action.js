var csvParse = require('csv-parse');

function parseFile(fileToParse) {
	//console.log("DATAPARSER", fileToParse);
	return new Promise(function(resolve,reject) {
		csvParse(fileToParse.preparedData, {delimiter: ';', columns: true}, function(err,parsedData) {
			if(err) {
				reject(err);
			} else {
				fileToParse.dataArray = parsedData;
				resolve(fileToParse);
			}
		});
	});
}

module.exports = parseFile;