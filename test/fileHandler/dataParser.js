var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}

describe("parses the data correctly", function() {
	var parseData = require('../../fileHandler/dataParser.action');

	function testDataParsing(example) {
		var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");
		var data = parseData({preparedData: solution.preparedData}).then(example.preparer).then(parseData);

		it("should add the parsed data to a dataArray attribute", function() {
			return expect(data).to.eventually.have.property('dataArray').that.is.not.empty;
		});

		it("has performed the correct parsing", function() {
			return expect(data).to.eventually.have.property('dataArray').that.is.deep.equal(solution.dataArray);
		});
	}

	[
		{ filename: 'argenta.csv' },
		{ filename: 'belfius.csv' }
	].forEach(testDataParsing);

});