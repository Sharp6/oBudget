var Verrichting = function(data) {
	this.verrichtingId = data.verrichtingId;
	this.status = data.status;
	this.csum = data.csum;

	this.bankRef = data.bankRef || '';
	this.datum = data.datum || '';
	this.bedrag = data.bedrag || '';
	this.rekeningTegenpartij = data.rekeningTegenpartij || '';
	this.valuta = data.valuta || '';
	this.naamTegenpartij = data.naamTegenpartij || '';
	this.type = data.type || '';
	this.mededeling = data.mededeling || '';
	this.info = data.info || '';
	this.bank = data.bank || '';

	this.categoryByBusinessRuleClassifier = data.categoryByBusinessRuleClassifier || '';
};

module.exports = Verrichting;