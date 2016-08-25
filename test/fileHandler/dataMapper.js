var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}

describe("maps the data fields to the internal model", function() {
	var assignDataHelpers = require("../../fileHandler/dataHelpersAssigner.action");
	
	function testDataMapping(example) {
		var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");

		var data = assignDataHelpers({dataArray: solution.dataArray, bank: solution.bank})
			.then(function(fileToParse) {
				return fileToParse.dataMapper(fileToParse);
			});
		it("has populated the field verrichtingData correctly.", function() {
			return expect(data).to.eventually.have.property('verrichtingData').that.is.deep.equal(solution.verrichtingData);
		});
	}

	[
		{ filename: 'argenta.csv' },
		{ filename: 'belfius.csv' }
	].forEach(testDataMapping);
});