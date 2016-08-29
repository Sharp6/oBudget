var verrichtingRepo = require('../verrichtingen/verrichting.repository.server');

function saveVerrichtingen(fileToParse) {
	var promise = Promise.resolve();
	fileToParse.verrichtingen.forEach(function(verrichting) {
		promise = promise.then(function() {
			return verrichtingRepo.save(verrichting);
		});
	});
	return promise.then(function() {
		return fileToParse;
	});
	
	/*
	Old code, which blocks the server.
	return new Promise(function(resolve,reject) {
		var promises = fileToParse.verrichtingen.map(function(verrichting) {
			return verrichtingRepo.save(verrichting);
		});
		return Promise.all(promises)
			.then(function(resultsArray) {
				resolve(fileToParse);
			});
	});
	*/
}

module.exports = saveVerrichtingen;