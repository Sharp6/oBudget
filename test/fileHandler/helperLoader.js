var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}

describe("loads the correct bank data helpers", function() {
	var assignDataHelpers = require("../../fileHandler/dataHelpersAssigner.action");

	function testCorrectDataPreparer(example) {
		it("loads the preparer for " + example.bank, function() {
			return expect(assignDataHelpers({bank: example.bank})).to.eventually.have.property('dataPreparer').that.is.not.empty;
		});
		it("loads the mapper for " + example.bank, function() {
			return expect(assignDataHelpers({bank: example.bank})).to.eventually.have.property('dataMapper').that.is.not.empty;
		});
	}

	[
		{ bank: 'belfius' },
		{ bank: 'argenta' }
	].forEach(testCorrectDataPreparer);
});