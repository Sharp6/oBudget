function visaMapper(fileToParse) {
	return new Promise(function(resolve,reject) {
		fileToParse.verrichtingData = fileToParse.dataArray.map(mapVisaRecord);
		resolve(fileToParse);
	});
}

function mapVisaRecord(data) {
	return {
		bedrag: data.bedrag,
		info: data.title + " " + data.subtitle,
		bank: 'visa',
		datum: data.datum,
		naamTegenpartij: data.title
	};
}

module.exports = visaMapper;