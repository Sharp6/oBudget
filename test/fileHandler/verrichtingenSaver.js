var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}

describe.only("saves the verrichtingen to a db", function() {
	var saveVerrichtingen = require('../../fileHandler/verrichtingenSaver.action');

	var mongoose = require('mongoose');
	var verrichtingDA = require('../../verrichtingen/verrichting.da.server');

	beforeEach(function() {
		mongoose.connect('mongodb://test:test@ds015636.mlab.com:15636/obudgettest');
		//mongoose.connect('mongodb://localhost/obudgetTest');
		//verrichtingDA.removeAll();
	});

	
	afterEach(function() {
		//verrichtingDA.removeAll();
		mongoose.connection.close();
	});
	

	function testSave(example) {
		var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");

		it("should have saved verrichtingen", function() {
			var data = saveVerrichtingen({ verrichtingen: solution.verrichtingen })
				.then(function() {
					return verrichtingDA.getAll();
				});
			// we should be able to check if the database has the correct number of records
			return expect(data).to.eventually.have.length(3);
		});
	}

	[
		{ filename: 'argenta.csv' }
	].forEach(testSave);

});