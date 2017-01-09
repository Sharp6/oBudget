function kbcMapper(fileToParse) {
	return new Promise(function(resolve,reject) {
		fileToParse.verrichtingData = fileToParse.dataArray.map(mapKbcRecord);
		resolve(fileToParse);
	});
}

function mapKbcRecord(data) {
	return {
		valuta: data.Munt,
		bedrag: data.Bedrag,
		info: data.Omschrijving,
		bank: 'kbc',
		datum: data.Datum
	};
}

module.exports = kbcMapper;


