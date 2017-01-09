require('dotenv').config();

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

var verrichtingDA = require('../verrichtingen/verrichting.da.server');

describe("The verrichtingDA", function() {

	beforeEach(function() {
		mongoose.connect(process.env.DB_HOST_TEST);
		verrichtingDA.removeAll();
	});

	afterEach(function(done) {
		verrichtingDA.removeAll();
		mongoose.connection.close(done);
	});


	// This test fails because the returned object is a mongoose model. As such, it has methods such as save e.a. 
	// Is it possible to check that the required fields occur on the returned object?
	it("should save a verrichting", function() {
		var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		// we will test the date later
		delete solution.verrichtingen[0].datum;
		// we don't want to persist this field
		delete solution.verrichtingen[0].categoryByBusinessRuleClassifier;

		var data = verrichtingDA.save(solution.verrichtingen[0])
			.then(verrichtingDA.getAll)
			.then(function(verrichtingen) {
				var verrichting = verrichtingen[0];
				return verrichting;
			});

		return data.then(function(act) {
			return expect(act).to.shallowDeepEqual(solution.verrichtingen[0]);
		});
	});

	it("should update a verrichting", function() {
		var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		var data = verrichtingDA.save(solution.verrichtingen[0])
			.then(function() {
				solution.verrichtingen[0].bedrag = 50;
				return verrichtingDA.save(solution.verrichtingen[0]);
			})
			.then(function() {
				return verrichtingDA.get(solution.verrichtingen[0].verrichtingId);
			});

		return expect(data).to.eventually.have.property("bedrag").that.equals(50);
	});

	it("should return a date in a given format", function() {
		var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		var data = verrichtingDA.save(solution.verrichtingen[0])
			.then(verrichtingDA.getAll)
			.then(function(verrichtingen) {
				return verrichtingen[0];
			})
			.then(function(verrichting) {
				return moment(verrichting.datum).toString();
			});

		return expect(data).to.eventually.equal(moment(solution.verrichtingen[0].datum).toString());
	});

	it("should be able to search on checksum", function() {
		var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		var data = verrichtingDA.save(solution.verrichtingen[0])
			.then(function() {
				return verrichtingDA.search({csum: "0084af947179cfc8da71a28cbf86509b8135d5e7"});
			});

		return expect(data).to.eventually.have.property('count').which.equals(1);
	});

	it("should remove a verrichting", function() {
		var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		var data = verrichtingDA.save(solution.verrichtingen[0])
			.then(function() {
				return verrichtingDA.remove(solution.verrichtingen[0]);
			})
			.then(function() {
				return verrichtingDA.getAll();
			});

		return expect(data).to.eventually.have.length(0);
	});

	it("should remove a verrichting while keeping another one", function() {
		var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		var data = Promise.all([verrichtingDA.save(solution.verrichtingen[0]),verrichtingDA.save(solution.verrichtingen[1])])
			.then(function() {
				return verrichtingDA.remove(solution.verrichtingen[0]);
			})
			.then(function() {
				return verrichtingDA.getAll();
			});

		return expect(data).to.eventually.have.length(1);
	});

	it("should do a bulk remove", function() {
		var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		var data = Promise.all([verrichtingDA.save(solution.verrichtingen[0]), verrichtingDA.save(solution.verrichtingen[1])])
			.then(function() {
				return verrichtingDA.removeBulk([solution.verrichtingen[0], solution.verrichtingen[1]]);
			})
			.then(function() {
				return verrichtingDA.getAll();
			});

		return expect(data).to.eventually.have.length(0);
	});

	it("should do a bulk remove while keeping another", function() {
		var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		var data = Promise.all([verrichtingDA.save(solution.verrichtingen[0]), verrichtingDA.save(solution.verrichtingen[1]), verrichtingDA.save(solution.verrichtingen[2])])
			.then(function() {
				return verrichtingDA.removeBulk([solution.verrichtingen[0], solution.verrichtingen[1]]);
			})
			.then(function() {
				return verrichtingDA.getAll();
			});

		return expect(data).to.eventually.have.length(1);
	});

	it("should be able to find the last verrichting for a bank", function() {
		var solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		var data = Promise.all([verrichtingDA.save(solution.verrichtingen[0]), verrichtingDA.save(solution.verrichtingen[1]), verrichtingDA.save(solution.verrichtingen[2])])
			.then(function() {
				return verrichtingDA.findLastVerrichtingForBank("argenta");
			});
		return expect(data).to.eventually.have.property("datumDisplay").which.equals("05/02/2014");
	});
});