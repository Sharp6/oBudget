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

describe("The categorieDA", function() {

	function loadCategorieen() {
		var promises = categorieData.map(function(data) {
			return categorieDA.save(data);
		});
		return Promise.all(promises);
	}

	beforeEach(function() {
		//mongoose.connect('mongodb://localhost/obudgetTest');
		mongoose.connect('mongodb://test:test@ds015636.mlab.com:15636/obudgettest');
		categorieDA.removeAll();
	});

	afterEach(function(done) {
		categorieDA.removeAll();
		mongoose.connection.close(done);
	});

	it("should save a categorie", function() {
		var data = categorieDA.save(categorieData[0])
			.then(categorieDA.getAll)
			.then(function(categorieen) {
				var categorie = categorieen[0];
				return categorie;
			});

		return data.then(function(act) {
			return expect(act).to.shallowDeepEqual(categorieData[0]);
		});
	});

	it("should save multiple categories", function() {
		var data = loadCategorieen()
			.then(categorieDA.getAll);

		return expect(data).to.eventually.have.length(4);
	});

	it("should find verrichtingen having a parent", function() {
		var data = loadCategorieen()
			.then(function() {
				return categorieDA.search({
					parentCategorieNaam: "hobby"
				});
			});

		return expect(data).to.eventually.have.length(2);
	});

	it("should find top level categories", function() {
		var data = loadCategorieen()
			.then(function() {
				return categorieDA.search({
					parentCategorieNaam: { $exists: false }
				});
			});

		return expect(data).to.eventually.have.length(1);
	});
});