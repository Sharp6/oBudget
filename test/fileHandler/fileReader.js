var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}

describe("reads the file correctly", function() {
	var readFile = require("../../fileHandler/fileReader.action");

	function testFileReading(example) {
		var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");

		it("should populate the rawData attribute for file " + example.filename, function() {
			var data = readFile({filename: './testDataFiles/'+example.filename});
			return expect(data).to.eventually.have.property('rawData').that.is.deep.equal(solution.rawData);
		});
	}

	[
		{ filename: 'argenta.csv' },
		{ filename: 'belfius.csv' }
	].forEach(testFileReading);
});