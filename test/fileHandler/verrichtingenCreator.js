var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
chai.use(require('chai-shallow-deep-equal'));
var sinon = require("sinon");

var mongoose = require('mongoose');
var moment = require('moment-timezone');
var fs = require('fs');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}

var createVerrichtingen = require("../../fileHandler/verrichtingenCreator.action");

describe("The action verrichtingenCreator", function() {
	var solution, data;

	beforeEach(function() {
		solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		data = createVerrichtingen({fixedVerrichtingData: solution.fixedVerrichtingData});
	});

	it("should add a verrichtingen array", function() {
		return expect(data).to.eventually.have.property('verrichtingen').with.length(3);
	});
});

describe("creates a new Verrichting", function() {
	function removeFields(verrichtingen) {
		verrichtingen.forEach(function(verrichting) {
			// Fields which will not be the same.
			delete verrichting.verrichtingId;
			delete verrichting.datum;
		});
	}
	
	function testVerrichtingCreation(example) {
		var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");
		removeFields(solution.verrichtingen);

		it("has something", function() {
			var data = createVerrichtingen({fixedVerrichtingData: solution.fixedVerrichtingData})
				.then(function(fileToParse) {
					removeFields(fileToParse.verrichtingen);
					return fileToParse;
				});

			return expect(data).to.eventually.have.property('verrichtingen').that.is.deep.equal(solution.verrichtingen);
		});
	}

	[
		{ filename: 'argenta.csv' }
	].forEach(testVerrichtingCreation);
});