var verrichtingRepo = require('../verrichtingen/verrichting.repository.server');

function createVerrichtingen(fileToParse) {
	return new Promise(function(resolve,reject) {
		fileToParse.verrichtingen = fileToParse.fixedVerrichtingData.map(function(data) {
			return verrichtingRepo.create(data);
		});
		resolve(fileToParse);
	});
}

module.exports = createVerrichtingen;