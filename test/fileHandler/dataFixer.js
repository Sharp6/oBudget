var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}

describe("fixes the syntax", function() {
	var fixSyntax = require('../../fileHandler/syntaxFixer.action');

	function testSyntaxFixing(example) {
		var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");

		var data = fixSyntax({ verrichtingData: solution.verrichtingData });
		it("has fixed fields.", function() {
			return expect(data).to.eventually.have.property('fixedVerrichtingData').that.is.deep.equal(solution.fixedVerrichtingData);
		});

		it("has converted bedrag to a number.");
	}

	[
		{ filename: 'argenta.csv' },
		{ filename: 'belfius.csv' }
	].forEach(testSyntaxFixing);
});