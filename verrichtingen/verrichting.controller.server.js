var verrichtingRepo = require('./verrichting.repository.server');

var verrichtingCtrl = function() {
	
	function getVerrichtingen(req,res) {
		verrichtingRepo.getAll()
			.then(function(verrichtingen) {
				res.send(verrichtingen);
			})
			.catch(function(err) {
				res.send(err);
			});
	}

	return {
		getVerrichtingen: getVerrichtingen
	};
};

module.exports = new verrichtingCtrl();
