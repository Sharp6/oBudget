function belfiusMapper(fileToParse) {
	return new Promise(function(resolve,reject) {
		fileToParse.verrichtingData = fileToParse.dataArray.map(mapBelfiusRecord);
		resolve(fileToParse);
	});
}

function mapBelfiusRecord(data) {
	var augmentedData = {};
	for (var dataAttribute in data) { augmentedData[dataAttribute] = data[dataAttribute]; }

	augmentedData.bank = 'belfius';
	augmentedData.datum = data['datumVerrichting'].replace(/\//g, '-');
	augmentedData.info = " - " + data.rekeningTegenpartij + " - " + data.naamTegenpartij + " - " + data.mededeling;
	return augmentedData;
}

module.exports = belfiusMapper;