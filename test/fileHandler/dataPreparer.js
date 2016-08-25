var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}

describe("prepares the data correctly", function() {
	var assignDataHelpers = require("../../fileHandler/dataHelpersAssigner.action");
	
	function testDataPreparation(example) {
		var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");
		
		it("should prepare " + example.filename + " correctly", function() {
			var data = assignDataHelpers({bank: solution.bank, rawData: solution.rawData})
				.then(function(fileToParse) {
					return fileToParse.dataPreparer(fileToParse);
				});
			return expect(data).to.eventually.have.property('preparedData').that.is.deep.equal(solution.preparedData);
		});
	}

	[
		{ filename: 'argenta.csv' },
		{ filename: 'belfius.csv' }
	].forEach(testDataPreparation);

});