function calculateExpectedSaldo(beginSaldo, verrichtingen) {
	var expectedSaldo = verrichtingen.reduce(function(huidigSaldo, verrichting) {
		return huidigSaldo + verrichting.bedrag;
	}, beginSaldo);

	return expectedSaldo;
}

module.exports = calculateExpectedSaldo;