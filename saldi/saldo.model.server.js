var Saldo = function(data) {
	this.saldoId = data.saldoId;
	this.bedrag = data.bedrag || 0;
	this.bankNaam = data.bankNaam || '';
	this.laatsteVerrichtingId = data.laatsteVerrichtingId || '';
};

module.exports = Saldo;