var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}

describe("Identifies the bank correctly", function() {
	var determineBank = require("../../fileHandler/bankDeterminer.action");

	function expectIdentifiedBank(example) {
		var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");
		it("identifies the bank for file " + example.filename + ".", function() {
			//return expect().to.eventually.have.property('bank').that.is.equal(example.bank);
			var data = determineBank({filename:'../testDataFiles/' + example.filename});
			return expect(data).to.eventually.contain.property('bank').that.is.deep.equal(solution.bank);
		});
	}

	[
		{ filename: "argenta.csv" },
		{ filename: "belfius.csv" },
		{ filename: "kbc.csv" }
	].forEach(expectIdentifiedBank);
});