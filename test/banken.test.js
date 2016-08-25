var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
chai.use(require('chai-shallow-deep-equal'));
var sinon = require("sinon");

var mongoose = require('mongoose');
var moment = require('moment-timezone');
var fs = require('fs');

describe("Banken", function() {
	describe("DA", function() {

		var bankDA = require('../banken/bank.da.server');

		beforeEach(function() {
			mongoose.connect('mongodb://test:test@ds015636.mlab.com:15636/obudgettest');
			//mongoose.connect('mongodb://localhost/obudgetTest');
			bankDA.removeAll();
		});

		afterEach(function(done) {
			bankDA.removeAll();
			mongoose.connection.close(done);
		});

		it('should save a bank', function() {
			var data = bankDA.save({ naam: 'testBank', startSaldo: 5})
				.then(function() {
					return bankDA.getAll();
				});

			return expect(data).to.eventually.have.length(1);
		});
	});
});