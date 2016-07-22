var chai = require("chai"), expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var sinon = require("sinon");

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
	
	describe("Identifies the bank correctly", function() {
		var determineBank = require("../fileHandler/bankDeterminer.action");

		function expectIdentifiedBank(example) {
			it("identifies a " + example.bank + " file", function() {
				return expect(determineBank({filename:example.filename})).to.eventually.have.property('bank').that.is.equal(example.bank);
			});
		}

		[
			{ bank: "belfius", filename: "belfius.csv"},
			{ bank: "belfius", filename: "dfdfdfbelfiusdfdf.csv"},
			{ bank: "belfius", filename: "belfius 12.csv"},
			{ bank: "argenta", filename: "argenta.csv"},
			{ bank: "argenta", filename: "Argenta.csv"},
			{ bank: "argenta", filename: " argenta.csv"},
			{ bank: "kbc", filename: "kbc 89.csv"}
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
			it("should populate the rawData attribute for file " + example.filename, function() {
				return expect(readFile({filename: './testDataFiles/'+example.filename})).to.eventually.have.property('rawData').that.is.not.empty;
			});
		}

		[
			{ filename: 'argenta.csv' },
			{ filename: 'argenta 2.csv' },
			{ filename: 'belfius.csv' },
			{ filename: 'kbc.csv' }
		].forEach(testFileReading);
		
	});

	describe("prepares the data correctly", function() {
		var readFile = require("../fileHandler/fileReader.action");
		var argentaPreparer = require('../fileHandler/dataPreparer.argenta.action');

		function testDataPreparation(example) {
			var data = readFile({filename: './testDataFiles/'+example.filename}).then(example.preparer);
			it("should prepare " + example.bank + " file " + example.filename + " correctly", function() {
				return expect(data).to.eventually.have.property('preparedData').that.is.not.empty;
			});
		}

		[
			{ bank: 'argenta', filename: 'argenta.csv', preparer: argentaPreparer },
			{ bank: 'argenta', filename: 'argenta 2.csv', preparer: argentaPreparer }
		].forEach(testDataPreparation);

	});

	describe("parses the data correctly", function() {
		var readFile = require("../fileHandler/fileReader.action");
		var argentaPreparer = require('../fileHandler/dataPreparer.argenta.action');
		var parseData = require('../fileHandler/dataParser.action');

		function testDataParsing(example) {
			var data = readFile({filename: './testDataFiles/'+example.filename}).then(example.preparer).then(parseData);
			it("should add the parsed data to a dataArray attribute", function() {
				return expect(data).to.eventually.have.property('dataArray').that.is.not.empty;
			});
			it("has read the correct number of records", function() {
				return expect(data).to.eventually.have.property('dataArray').with.length(example.records);
			});
		}

		[
			{ bank: 'argenta', filename: 'argenta.csv', preparer: argentaPreparer, records: 3 },
			{ bank: 'argenta', filename: 'argenta 2.csv', preparer: argentaPreparer, records: 3 }
		].forEach(testDataParsing);

	});

	describe("maps the data fields to the internal model", function() {
		var readFile = require("../fileHandler/fileReader.action");
		var argentaPreparer = require('../fileHandler/dataPreparer.argenta.action');
		var parseData = require('../fileHandler/dataParser.action');
		var argentaMapper = require('../fileHandler/dataMapper.argenta.action');

		function testDataMapping(example) {
			var data = readFile({filename: './testDataFiles/'+example.filename}).then(example.preparer).then(parseData).then(example.dataMapper);
			it("has populated the field verrichtingData", function() {
				return expect(data).to.eventually.have.property('verrichtingData').that.is.not.empty;
			});
			it("has a date");
			/*
			LEARN HOW TO DO DEEP EXISTS
			, function() {
				return expect(data).to.eventually.have.property('verrichtingData').that.has.a.property('datum');
			});
			*/
		}

		[
			{ bank: 'argenta', filename: 'argenta.csv', preparer: argentaPreparer, dataMapper: argentaMapper},
			{ bank: 'argenta', filename: 'argenta 2.csv', preparer: argentaPreparer, dataMapper: argentaMapper}
		].forEach(testDataMapping);


	});

	// These tests should be performed at the level of a verrichting, not at the file level. 
	// Perhaps even the one above: this shows why the deep nesting was a problem
	describe("fixes the syntax of the data fields", function() {
		var readFile = require("../fileHandler/fileReader.action");
		var argentaPreparer = require('../fileHandler/dataPreparer.argenta.action');
		var parseData = require('../fileHandler/dataParser.action');
		var argentaMapper = require('../fileHandler/dataMapper.argenta.action');
		var fixSyntax = require('../fileHandler/syntaxFixer.action');

		function testFieldSyntax(example) {
			var data = readFile({filename: './testDataFiles/'+example.filename}).then(example.preparer).then(parseData).then(example.dataMapper).then(fixSyntax);
			it("has has a bedrag with no commas");
		}

		[
			{ bank: 'argenta', filename: 'argenta.csv', preparer: argentaPreparer, dataMapper: argentaMapper},
			{ bank: 'argenta', filename: 'argenta 2.csv', preparer: argentaPreparer, dataMapper: argentaMapper}
		].forEach(testFieldSyntax);
	});

	describe("creates a new Verrichting", function() {
		var readFile = require("../fileHandler/fileReader.action");
		var argentaPreparer = require('../fileHandler/dataPreparer.argenta.action');
		var parseData = require('../fileHandler/dataParser.action');
		var argentaMapper = require('../fileHandler/dataMapper.argenta.action');
		var fixSyntax = require('../fileHandler/syntaxFixer.action');
		var createVerrichtingen = require('../fileHandler/verrichtingenCreator.action');
		
		function testVerrichtingCreation(example) {
			it("has an id");
			it("has status imported");
		}

		[
			{ bank: 'argenta', filename: 'argenta.csv', preparer: argentaPreparer, dataMapper: argentaMapper},
			{ bank: 'argenta', filename: 'argenta 2.csv', preparer: argentaPreparer, dataMapper: argentaMapper}
		].forEach(testVerrichtingCreation);
	});

	describe("saves the verrichtingen to a db", function() {

		var readFile = require("../fileHandler/fileReader.action");
		var argentaPreparer = require('../fileHandler/dataPreparer.argenta.action');
		var parseData = require('../fileHandler/dataParser.action');
		var argentaMapper = require('../fileHandler/dataMapper.argenta.action');
		var fixSyntax = require('../fileHandler/syntaxFixer.action');
		var createVerrichtingen = require('../fileHandler/verrichtingenCreator.action');
		var saveVerrichtingen = require('../fileHandler/verrichtingenSaver.action');

		var mongoose = require('mongoose');
		mongoose.connect('mongodb://localhost/phinanceTest');

		function testSave(example) {
			var data = readFile({filename: './testDataFiles/'+example.filename}).then(example.preparer).then(parseData).then(example.dataMapper).then(fixSyntax).then(createVerrichtingen).then(saveVerrichtingen);
		}

		[
			{ bank: 'argenta', filename: 'argenta.csv', preparer: argentaPreparer, dataMapper: argentaMapper},
			{ bank: 'argenta', filename: 'argenta 2.csv', preparer: argentaPreparer, dataMapper: argentaMapper}
		].forEach(testSave);

	});
});