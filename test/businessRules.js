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
	var businessRules = businessRuleClassifier.loadBusinessRules();

	it("should load business rules", function() {
		return expect(businessRules).to.not.be.empty;
	});


	describe("properties", function() {
		it("should have the indicatorString property", function() {
			return expect(businessRules[0]).to.have.property("indicatorString");
		});

		it("should have the categoryName property", function() {
			return expect(businessRules[0]).to.have.property("categoryName");
		});
	});

	describe("should classify", function() {
		it("a Dagelijkse kosten verrichting", function() {
			return expect(businessRuleClassifier.classify(solution.verrichtingen[0])).to.equal('Dagelijkse kosten');
		});
	});
	
});