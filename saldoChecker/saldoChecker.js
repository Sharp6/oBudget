var calculateExpectedSaldo = require('./expectedSaldoCalculator.action');

function checkExpectedSaldo(verwachtSaldo, echtSaldo) {
	// FUCK DECIMALS IN JS
	console.log("SALDO CHECKER DIFFERENCE: ", Math.floor(verwachtSaldo), Math.floor(echtSaldo));
	return Math.floor(verwachtSaldo) == Math.floor(echtSaldo);
}

function doCheck(echtSaldo, verrichtingen, beginSaldo) {
	var verwachtSaldo = calculateExpectedSaldo(beginSaldo, verrichtingen);
	return checkExpectedSaldo(verwachtSaldo, echtSaldo);
}

module.exports = doCheck;