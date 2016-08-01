var Bank = function(data) {
	this.naam = data.naam || 'NoNameBank';
	this.startSaldo = data.startSaldo || 0;
};

module.exports = Bank;