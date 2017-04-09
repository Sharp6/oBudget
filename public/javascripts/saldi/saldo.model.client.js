define(['knockout', 'moment'], function(ko, moment) {
	var SaldoModel = function(data) {
		var self = this;

        self.saldoId = data.saldoId;
        self.bedrag = data.bedrag;
        self.bankNaam = data.bankNaam;
        self.laatsteVerrichtingId = data.laatsteVerrichtingId;

        self.verified = ko.observable();
	};
	
	return SaldoModel;
});