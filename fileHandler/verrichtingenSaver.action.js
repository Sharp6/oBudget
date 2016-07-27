var verrichtingRepo = require('../verrichtingen/verrichting.repository.server');

function saveVerrichtingen(fileToParse) {
	return new Promise(function(resolve,reject) {
		var promises = fileToParse.verrichtingen.map(function(verrichting) {
			return verrichtingRepo.save(verrichting);
		});
		return Promise.all(promises)
			.then(function(resultsArray) {
				resolve(fileToParse);
			});
	});
}

module.exports = saveVerrichtingen;