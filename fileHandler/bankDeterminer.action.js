// requires a lcio with a filename attribute
function determineBank(fileToParse) {
	return new Promise(function(resolve,reject) {
		var bank;
		if(fileToParse.filename.toLowerCase().indexOf("belfius") !== -1) {
			bank = "belfius";
		} else if(fileToParse.filename.toLowerCase().indexOf("argenta") !== -1) {
			bank = "argenta";
		} else if(fileToParse.filename.toLowerCase().indexOf("kbc") !== -1) {
			bank = "kbc";
		}

		if(bank) {
			fileToParse.bank = bank;
			//console.log("Bank determined to be " + fileToParse.bank + ".");
			resolve(fileToParse);
		} else {
			reject("No known bank");
		}
	});
}

module.exports = determineBank;