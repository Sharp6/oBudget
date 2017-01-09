var Bank = function(data) {
	this.naam = data.naam || 'NoNameBank';
	this.startSaldo = data.startSaldo || 0;
	this.lopendSaldo = data.lopendSaldo || 0;
	this.huidigBerekendSaldo = data.huidigBerekendSaldo || 0;
	this.datumLaatsteVerrichting = data.datumLaatsteVerrichting || '';
};

module.exports = Bank;