var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var filesCollector = require('../../filesCollector');

describe("Files are loaded", function() {
	context("Given that files are present in the directory", function() {
		it("finds 4 files", function() {
			return expect(filesCollector.loadFiles("./testDataFiles")).to.eventually.have.length(4);
		});
	});

	context("Given that no files are present in the directory", function() {
		it("returns an empty array", function() {
			return expect(filesCollector.loadFiles("./testDataFilesEmpty")).to.eventually.have.length(0);
		});
	});
});
