var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}

describe("The verrichting repository", function() {
	var mongoose = require('mongoose');
	
	var verrichtingRepo = require('../verrichtingen/verrichting.repository.server');
	var verrichtingDA = require('../verrichtingen/verrichting.da.server');

	var createVerrichtingen = require('../fileHandler/verrichtingenCreator.action');
	var saveVerrichtingen = require('../fileHandler/verrichtingenSaver.action');

	var solution;

	beforeEach(function() {
		mongoose.connect('mongodb://test:test@ds015636.mlab.com:15636/obudgettest');
		//mongoose.connect('mongodb://localhost/obudgetTest');
		verrichtingDA.removeAll();
		solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
	});

	afterEach(function(done) {
		verrichtingDA.removeAll();
		mongoose.connection.close(done);
	});

	it("should get all saved verrichtingen", function() {
		var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");

		var data = saveVerrichtingen({ verrichtingen: solution.verrichtingen })
			.then(verrichtingRepo.getAll);

		return expect(data).to.eventually.have.length(3);
	});

	it("should be possibly to add duplicate verrichtingen with a different verrichtingId", function() {
		var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		var verrichtingen = [
			verrichtingRepo.create(solution.verrichtingData[0]),
			verrichtingRepo.create(solution.verrichtingData[0])
		];

		var ids = verrichtingen.map(function(verrichting) {
			return verrichting.verrichtingId;
		});

		return expect(ids[0]).to.not.equal(ids[1]);
	});

	it("should remove duplicates", function() {
		var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");

		var data = Promise.all([createVerrichtingen({ fixedVerrichtingData: solution.fixedVerrichtingData }), createVerrichtingen({ fixedVerrichtingData: solution.fixedVerrichtingData })])
			.then(function(responses) {
				return responses[0].verrichtingen.concat(responses[1].verrichtingen);
			})
			.then(function(verrichtingen) {
				return saveVerrichtingen({verrichtingen: verrichtingen});
			})
			.then(verrichtingRepo.getAll)
			.then(function(verrichtingen) {

				return new Promise(function(resolve, reject) {
					var chain = Promise.resolve();
					verrichtingen.forEach(function(verrichting) {
						chain = chain.then(function() {
							return verrichtingRepo.handleDuplicates(verrichting.csum);
						});
					});
					chain.then(function() {
						resolve();
					})
					.catch(function(err) {
						reject(err);
					});
				});
			})
			.then(function() {
				return verrichtingRepo.getAll();
			});

		return expect(data).to.eventually.have.length(3);
	});
	
	describe("using finders", function() {
		it("should return the correct verrichtingen", function() {
			var data = saveVerrichtingen({ verrichtingen: solution.verrichtingen })
				.then(verrichtingRepo.getAll)
				.then(function(verrichtingen) {
					return verrichtingRepo.findVerrichtingenForBankBefore(verrichtingen[0].bank, verrichtingen[0].datum);
				});

			return expect(data).to.eventually.have.length(3);
		});
	});

});