function argentaMapper(fileToParse) {
	return new Promise(function(resolve,reject) {
		fileToParse.verrichtingData = fileToParse.dataArray.map(mapArgentaRecord);
		resolve(fileToParse);
	});
}

function mapArgentaRecord(data) {
	return {
		bankRef: data['Ref. v/d verrichting'],
		datum: data['Valutadatum'],
		bedrag: data['Bedrag v/d verrichting'],
		rekeningTegenpartij: data['Rekening tegenpartij'],
		valuta: data['Munt'],
		naamTegenpartij: data['Naam v/d tegenpartij :'],
		type: data['Beschrijving'],
		mededeling: data['Mededeling 1 :'],
		info: data.rekeningTegenpartij + " - " + data.naamTegenpartij + " - " + data['Beschrijving'] + " - " + data['Mededeling 1 :'] + " - " + data['Mededeling 2 :'],
		bank: 'argenta'
	};
}

module.exports = argentaMapper;