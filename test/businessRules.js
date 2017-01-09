var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

var businessRuleClassifier = require('../classifier/businessRuleClassifier');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}
var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");

describe("The business rule classifier", function() {
	describe("should classify", function() {
		it("a Dagelijkse kosten verrichting", function() {
			return expect(businessRuleClassifier.classify(solution.verrichtingen[0])).to.eventually.equal('Dagelijkse kosten');
		});
	});
});