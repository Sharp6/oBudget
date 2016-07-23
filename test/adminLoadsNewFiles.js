var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

var fs = require('fs');

var filesCollector = require('../filesCollector');

// outside in
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



// inside out
describe("Workflow for one new file", function() {
	// for a workflow, it should be tested that all actions are called once.

	// Below are the tests for the individual actions. These should probably be separated.

	// I think the solution loading can happen in a beforeEach.

	function loadSolution(filename) {
		return JSON.parse(fs.readFileSync(filename).toString());
	}

	describe("Identifies the bank correctly", function() {
		var determineBank = require("../fileHandler/bankDeterminer.action");

		function expectIdentifiedBank(example) {
			var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");
			it("identifies the bank for file " + example.filename + ".", function() {
				//return expect().to.eventually.have.property('bank').that.is.equal(example.bank);
				var data = determineBank({filename:'../testDataFiles/' + example.filename});
				return expect(data).to.eventually.contain.property('bank').that.is.deep.equal(solution.bank);
			});
		}

		[
			{ filename: "argenta.csv"}
		].forEach(expectIdentifiedBank);
	});

	describe("loads the correct bank data helpers", function() {
		var assignDataHelpers = require("../fileHandler/dataHelpersAssigner.action");

		function testCorrectDataPreparer(example) {
			it("loads the preparer for " + example.bank, function() {
				return expect(assignDataHelpers({bank: example.bank})).to.eventually.have.property('dataPreparer').that.is.not.empty;
			});
			it("loads the mapper for " + example.bank, function() {
				return expect(assignDataHelpers({bank: example.bank})).to.eventually.have.property('dataMapper').that.is.not.empty;
			});
		}

		[
			{ bank: 'belfius' },
			{ bank: 'argenta' },
			{ bank: 'kbc' }
		].forEach(testCorrectDataPreparer);

	});

	describe("reads the file correctly", function() {
		var readFile = require("../fileHandler/fileReader.action");

		function testFileReading(example) {
			var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");

			it("should populate the rawData attribute for file " + example.filename, function() {
				var data = readFile({filename: './testDataFiles/'+example.filename});
				return expect(data).to.eventually.have.property('rawData').that.is.deep.equal(solution.rawData);
			});
		}

		[
			{ filename: 'argenta.csv' }
		].forEach(testFileReading);
		
	});

	describe("prepares the data correctly", function() {
		var assignDataHelpers = require("../fileHandler/dataHelpersAssigner.action");
		
		function testDataPreparation(example) {
			var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");
			
			it("should prepare " + example.filename + " correctly", function() {
				var data = assignDataHelpers({bank: solution.bank, rawData: solution.rawData})
					.then(function(fileToParse) {
						return fileToParse.dataPreparer(fileToParse);
					});
				return expect(data).to.eventually.have.property('preparedData').that.is.deep.equal(solution.preparedData);
			});
		}

		[
			{ filename: 'argenta.csv' }
		].forEach(testDataPreparation);

	});

	describe("parses the data correctly", function() {
		var parseData = require('../fileHandler/dataParser.action');

		function testDataParsing(example) {
			var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");
			var data = parseData({preparedData: solution.preparedData}).then(example.preparer).then(parseData);

			it("should add the parsed data to a dataArray attribute", function() {
				return expect(data).to.eventually.have.property('dataArray').that.is.not.empty;
			});
			it("has performed the correct parsing", function() {
				return expect(data).to.eventually.have.property('dataArray').that.is.deep.equal(solution.dataArray);
			});
		}

		[
			{ filename: 'argenta.csv' }
		].forEach(testDataParsing);

	});

	// tests two separate actions at once, since syntaxFixer modifies the verrichtingData field instead of creating its own field.
	// Currently fails because verrichtingeRepo adds fields to verrichtingData which it does not expect.
	describe("maps the data fields to the internal model and fixes the syntax", function() {
		var assignDataHelpers = require("../fileHandler/dataHelpersAssigner.action");
		var fixSyntax = require('../fileHandler/syntaxFixer.action');

		function testDataMapping(example) {
			var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");

			var data = assignDataHelpers({dataArray: solution.dataArray, bank: solution.bank})
				.then(function(fileToParse) {
					return fileToParse.dataMapper(fileToParse);
				})
				.then(fixSyntax);
			it("has populated the field verrichtingData correctly.", function() {
				return expect(data).to.eventually.have.property('verrichtingData').that.is.deep.equal(solution.verrichtingData);
			});
		}

		[
			{ filename: 'argenta.csv' }
		].forEach(testDataMapping);


	});


	// This test fails because ids are regenerated every time (which is correct), but this means no deep.equal can be used. 
	// Or can exceptions to deep equal be specified?
	describe("creates a new Verrichting", function() {
		var createVerrichtingen = require('../fileHandler/verrichtingenCreator.action');
		
		function testVerrichtingCreation(example) {
			var solution = loadSolution('./testDataFilesSolutions/' + example.filename + ".solution.json");

			var data = createVerrichtingen({verrichtingData: solution.verrichtingData});
			it("has something", function() {
				return expect(data).to.eventually.have.property('verrichtingen').that.is.deep.equal(solution.verrichtingen);
			});
			
		}

		[
			{ filename: 'argenta.csv' }
		].forEach(testVerrichtingCreation);
	});

/*
	// How do we test the database? Integration test?
	describe("saves the verrichtingen to a db", function() {

		var readFile = require("../fileHandler/fileReader.action");
		var argentaPreparer = require('../fileHandler/dataPreparer.argenta.action');
		var parseData = require('../fileHandler/dataParser.action');
		var argentaMapper = require('../fileHandler/dataMapper.argenta.action');
		var fixSyntax = require('../fileHandler/syntaxFixer.action');
		var createVerrichtingen = require('../fileHandler/verrichtingenCreator.action');
		var saveVerrichtingen = require('../fileHandler/verrichtingenSaver.action');

		var mongoose = require('mongoose');
		mongoose.connect('mongodb://localhost/obudgetTest');
		var verrichtingDA = require('../verrichtingen/verrichting.da.server');


		beforeEach(function() {
			verrichtingDA.deleteAll();
		});

		afterEach(function() {
			verrichtingDA.deleteAll();
		});

		function testSave(example) {
			it("should have saved verrichtingen", function() {
				var data = readFile({filename: './testDataFiles/'+example.filename})
					.then(example.preparer).then(parseData).then(example.dataMapper).then(fixSyntax).then(createVerrichtingen)
					.then(saveVerrichtingen).catch(function(err)
						{
							console.log("ERR",err);
						});
				// we should be able to check if the database has the correct number of records
				return expect(data).to.eventually.have.property('verrichtingData').that.is.not.empty;
			});
		}

		[
			{ bank: 'argenta', filename: 'argenta.csv', preparer: argentaPreparer, dataMapper: argentaMapper},
			{ bank: 'argenta', filename: 'argenta 2.csv', preparer: argentaPreparer, dataMapper: argentaMapper}
		].forEach(testSave);

	});
*/
});