function argentaMapper(fileToParse) {
	return new Promise(function(resolve,reject) {
		fileToParse.verrichtingData = fileToParse.dataArray.map(mapArgentaRecord);
		console.log("DATUM IN VERRICHTINGDATA", fileToParse.verrichtingData[0].datum);
		resolve(fileToParse);
	});
}

function mapArgentaRecord(data) {

	console.log("DATUM IN MAPPER", data.Valutadatum);

	return {
		bankRef: data['Ref. v/d verrichting'],
		datum: data['Valutadatum'],
		bedrag: data['Bedrag v/d verrichting'],
		rekeningTegenpartij: data['Rekening tegenpartij'],
		valuta: data['Munt'],
		naamTegenpartij: data['Naam v/d tegenpartij :'],
		type: data['Beschrijving'],
		mededeling: data['Mededeling 1 :'],
		info: data['Rekening tegenpartij'] + " - " + data['Naam v/d tegenpartij :'] + " - " + data['Beschrijving'] + " - " + data['Mededeling 1 :'] + " - " + data['Mededeling 2 :'],
		bank: 'argenta'
	};
}

module.exports = argentaMapper;