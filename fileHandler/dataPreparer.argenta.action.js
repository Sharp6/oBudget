function doPrepare(fileToParse) {
	return new Promise(function(resolve,reject) {
		if(fileToParse.rawData.substring(0,15) === "Nr v/d rekening") {
			var position = fileToParse.rawData.indexOf('\n');
			if (position == -1) {
				reject("No lines found in file.");
			} else {
				data = fileToParse.rawData.substr(position + 1);
				fileToParse.preparedData = data;
				resolve(fileToParse);
			}
		} else {
			fileToParse.preparedData = fileToParse.rawData;
			resolve(fileToParse);
		}
	});
}

module.exports = doPrepare;