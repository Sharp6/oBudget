function fixSyntax(fileToParse) {
	return new Promise(function(resolve,reject) {
		
		fileToParse.fixedVerrichtingData = fileToParse.verrichtingData.map(function(data) {
			var fixedData = {};
			for (var dataAttribute in data) { fixedData[dataAttribute] = data[dataAttribute]; }

			var bedragString = fixedData.bedrag.toString();
			bedragString = bedragString.replace('.', '');
			bedragString = bedragString.replace(',', '.');
			fixedData.bedrag = parseFloat(bedragString);

			return fixedData;
			//data.datumObject = moment(data.datumVerrichting, "DD-MM-YYYY");
		});
		resolve(fileToParse);
	});
}

module.exports = fixSyntax;