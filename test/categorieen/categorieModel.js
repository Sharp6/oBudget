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

//var categorieData = loadSolution('./testDataFilesSolutions/' + "categorieen.json");

var categorieDA = require('../../categorieen/categorie.da.server');
var categorieRepo = require('../../categorieen/categorie.repository.server');
describe("Het categorieModel", function() {

/*
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

*/
	var categorie, topCategorie;
	beforeEach(function() {
		topCategorie = categorieRepo.create({ naam: "testTop" });
		categorie = categorieRepo.create({ naam: "test", parentCategorieNaam: "testTop" });
	});

	it("creates a categorie", function() {
		return expect(categorie).to.eventually.have.property('parentCategorieNaam');
	});

	describe("knows if it is a top level categorie", function() {
		it("when it is", function() {
			return expect(topCategorie.then(function(cat) { return cat.isTopCategorie(); })).to.eventually.equal(true);
		});

		it("when it is not", function() {
			return expect(categorie.then(function(cat) { return cat.isTopCategorie(); })).to.eventually.equal(false);
		});
	});

});