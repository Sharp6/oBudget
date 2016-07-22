var fs = require('fs');

function rFile(fileToParse) {
	return new Promise(function(resolve,reject) {
		fs.readFile(fileToParse.filename, function(err, data) {
			if (err) {
				reject(err);
			} else {
				fileToParse.rawData = data.toString();
				resolve(fileToParse);
			}
		});
	});
}

module.exports = rFile;