var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

// inside out
describe("Workflow for one new file", function() {
	// for a workflow, it should be tested that all actions are called once.

	// Below are the tests for the individual actions. These should probably be separated.

	// I think the solution loading can happen in a beforeEach.

	function loadSolution(filename) {
		return JSON.parse(fs.readFileSync(filename).toString());
	}

	// This test fails because ids are regenerated every time (which is correct), but this means no deep.equal can be used. 
	// Or can exceptions to deep equal be specified?
	


	// How do we test the database? Integration test?

});