require('dotenv').config();

var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}

describe("The whole fileHandler shabang", function() {
	var fileHandler = require('../../fileHandler');
	var mongoose = require('mongoose');
	var verrichtingDA = require('../../verrichtingen/verrichting.da.server');

	beforeEach(function(done) {
		mongoose.connect(process.env.DB_HOST_TEST);
		verrichtingDA.removeAll().then(function() { done(); });
	});
	
	afterEach(function(done) {
		verrichtingDA.removeAll()
			.then(function() {
				mongoose.connection.close(done);
			});
	});

	it("should result in saved verrichtingen", function() {
		var data = fileHandler.handleFile("./testDataFiles/argenta.csv")
			.then(function() {
				return verrichtingDA.getAll()
					.then(function(result) {
						return result;
					});
			});

		return expect(data).to.eventually.have.length(3);
	});
});