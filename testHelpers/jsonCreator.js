var fs = require('fs');

var determineBank = require("../fileHandler/bankDeterminer.action");
var assignDataHelpers = require("../fileHandler/dataHelpersAssigner.action");
var readFile = require("../fileHandler/fileReader.action");
var parseData = require('../fileHandler/dataParser.action');
var fixSyntax = require('../fileHandler/syntaxFixer.action');
var createVerrichtingen = require('../fileHandler/verrichtingenCreator.action');

var fileToParse = {
	filename: "../testDataFiles/argenta.csv"
};

determineBank(fileToParse)
	.then(assignDataHelpers)
	.then(readFile)
	.then(function(fileToParse) {
		return fileToParse.dataPreparer(fileToParse);
	})
	.then(parseData)
	.then(function(fileToParse) {
		return fileToParse.dataMapper(fileToParse);
	})
	.then(fixSyntax)
	.then(createVerrichtingen)
	.then(function(fileToParse) {
		var path = "../testDataFilesSolutions/" + fileToParse.filename.split("/")[2] + ".solution.json";
		fs.writeFile(path, JSON.stringify(fileToParse), function(err) {
			if (err) {
				console.log("writeError: " + err);
			} else {
				console.log("Succesfully saved testing solution.");
			}
		});
	})
	.catch(function(err) {
		console.log("err", err);
	});