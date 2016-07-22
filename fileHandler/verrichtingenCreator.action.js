var verrichtingRepo = require('../verrichtingen/verrichting.repository.server');

function createVerrichtingen(fileToParse) {
	return new Promise(function(resolve,reject) {
		fileToParse.verrichtingen = fileToParse.verrichtingData.map(function(data) {
			return verrichtingRepo.create(data);
		});
	});
}

module.exports = createVerrichtingen;