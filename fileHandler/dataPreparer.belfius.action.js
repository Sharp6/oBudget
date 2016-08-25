function prepareBelfiusFile(fileToParse) {
	// For belfius files, headers should be added.
	return new Promise(function(resolve,reject) {
		belfiusHeaders = "rekeningOpvrager;datumVerrichting;bogus1;bogus2;rekeningTegenpartij;naamTegenpartij;adres1Tegenpartij;adres2Tegenpartij;mededeling;datumOpdracht;bedrag;valuta;bic;land\r\n";
		if(fileToParse.rawData.substring(0,10) === belfiusHeaders.substring(0,10)) {
			// All ok
			console.log("BELFIUS DATA PREPARER: Headers already added.");
			resolve(fileToParse);
		} else {
			fileToParse.preparedData = belfiusHeaders + fileToParse.rawData;
			resolve(fileToParse);
		}
	});
}

module.exports = prepareBelfiusFile;