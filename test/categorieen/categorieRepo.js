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

var categorieData = loadSolution('./testDataFilesSolutions/' + "categorieen.json");

var categorieDA = require('../../categorieen/categorie.da.server');
var categorieRepo = require('../../categorieen/categorie.repository.server');

describe("The categorieRepo", function() {

	function loadCategorieen() {
		var promises = categorieData.map(function(data) {
			return categorieDA.save(data);
		});
		return Promise.all(promises);
	}

	beforeEach(function() {
		mongoose.connect('mongodb://localhost/obudgetTest');
		categorieDA.removeAll();
	});

	afterEach(function(done) {
		categorieDA.removeAll();
		mongoose.connection.close(done);
	});

	it("creates a categorie", function() {
		var data = categorieRepo.create({ naam: "test" });
		return expect(data).to.eventually.have.property('parentCategorieNaam');
	});

	describe("can find child categories", function() {
		it("on the bottom layer", function() {
			var data = loadCategorieen()
				.then(function() {
					return categorieRepo.getCategorieByNaam("Arduino");
				});

			return expect(data).to.eventually.have.property("childCategorieen").with.length(0);
		});

		it("on the middle layer", function() {
			var data = loadCategorieen()
				.then(function() {
					return categorieRepo.getCategorieByNaam("elektronica");
				});

			return expect(data).to.eventually.have.property("childCategorieen").with.length(1);
		});

		it("on the top layer", function() {
			var data = loadCategorieen()
				.then(function() {
					return categorieRepo.getCategorieByNaam("hobby");
				});

			return expect(data).to.eventually.have.property("childCategorieen").with.length(2);
		});
	});

});