require('dotenv').config();

var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
chai.use(require('chai-shallow-deep-equal'));
var sinon = require("sinon");

var moment = require('moment-timezone');
var mongoose = require('mongoose');
var fs = require('fs');

function loadSolution(filename) {
	return JSON.parse(fs.readFileSync(filename).toString());
}

describe("The saldo-checker", function() {
	it("should check if it got valid verrichting, bank and saldo objects.");

	describe("calculating the expected saldo", function() {

		var solution;
		var calculateExpectedSaldo = require('../../saldoChecker/expectedSaldoCalculator.action');

		beforeEach(function() {
			solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		});

		it("returns the correct expected saldo", function() {
			var data = calculateExpectedSaldo(100, solution.verrichtingen);
			return expect(data).to.be.equal(1160.54);
		});
	});
});

describe("The saldo checker flow", function() {

	var verrichtingDA = require('../../verrichtingen/verrichting.da.server');
	var saldoDA = require('../../saldi/saldo.da.server');
	var bankDA = require('../../banken/bank.da.server');

	var bankRepo = require('../../banken/bank.repository.server');
	var saldoRepo = require('../../saldi/saldo.repository.server');
	var verrichtingRepo = require('../../verrichtingen/verrichting.repository.server');

	var saldoCheckerCtrl = require('../../saldoChecker/saldoChecker.controller.server');
	var solution;

	beforeEach(function(done) {
		solution = loadSolution('./testDataFilesSolutions/' + "argenta.csv" + ".solution.json");
		mongoose.connect(process.env.DB_HOST_TEST, function() {
			Promise.all([
				verrichtingDA.removeAll(),
				saldoDA.removeAll(),
				bankDA.removeAll()
			]).then(function() {
				done();
			});

		});
	});

	afterEach(function(done) {
		Promise.all([
			verrichtingDA.removeAll(),
			saldoDA.removeAll(),
			bankDA.removeAll()
		]).then(function() {
			mongoose.connection.close(done);
		});
	});

	function loadData() {
		return verrichtingDA.save(solution.verrichtingen[0])
			.then(function() {
				return Promise.all([
					bankRepo.create({ naam: 'argenta', startSaldo: 100 }),
					saldoRepo.create({ bedrag: 80.54, bankNaam: 'argenta', laatsteVerrichtingId: solution.verrichtingen[0].verrichtingId })
				]);
			})
			.then(function(results) {
				return Promise.all([
					bankRepo.save(results[0]),
					saldoRepo.save(results[1])
				]);
			});
	}

	it("should perform a correct saldo check", function() {
		var data = loadData()
			.then(function() {
				return saldoRepo.getAll();
			})
			.then(function(saldi) {
				return saldoCheckerCtrl.checkSaldoFlow(saldi[0].saldoId);
			})
			.catch(function(err) {
				console.log(err);
			});

		return expect(data).to.eventually.contain.property('checkResult').that.equals(true);
	});
});