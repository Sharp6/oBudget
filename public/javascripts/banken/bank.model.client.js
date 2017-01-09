define(['knockout', 'moment'], function(ko, moment) {
	var BankModel = function(data) {
		var self = this;

		self.naam = data.naam;
		self.startSaldo = data.startSaldo;
		self.lopendSaldo = data.lopendSaldo;
		self.huidigBerekendSaldo = Math.round(data.huidigBerekendSaldo);
		self.datumLaatsteVerrichting = data.datumLaatsteVerrichting;
	};
	
	return BankModel;
});