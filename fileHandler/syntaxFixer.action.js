function fixSyntax(fileToParse) {
	return new Promise(function(resolve,reject) {
		
		fileToParse.verrichtingData.forEach(function(record) {
			var bedragString = record.bedrag.toString();
			bedragString = bedragString.replace('.', '');
			bedragString = bedragString.replace(',', '.');
			record.bedrag = parseFloat(bedragString);

			//data.datumObject = moment(data.datumVerrichting, "DD-MM-YYYY");
		});
		resolve(fileToParse);
	});
}

module.exports = fixSyntax;