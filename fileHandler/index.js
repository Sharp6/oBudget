var moment = require('moment');

var verrichtingDA = require('../dataAccess/verrichting.server.da');
var commandDA = require('../dataAccess/command.server.da');

// actions
var determineBank = require('./bankDeterminer.action');
var assignDataHelpers = require('./dataHelpersAssigner.action');
var readFile = require('./fileReader.action');
var parseData = require('./dataParser.action');
var fixSyntax = require('./syntaxFixer.action');

function executeHandling(filename) {
	var fileToParse = {
		filename: filename
	};

	return determineBank(fileToParse)
		.then(assignDataHelpers)
		.then(readFile)
		.then(fileToParse.dataPreparer)
		.then(parseData)
		.then(mapDataFields)
		.then(fixSyntax)
		.then(persistVerrichtingen)
		.then(logCommand);
}

function logCommand(fileToParse) {
	return new Promise(function(resolve,reject) {
		commandDA.saveCommand({commandType: 'import file', filename: fileToParse.filename})
			.then(function() {
				resolve(fileToParse);
			});
	});
}

module.exports = {
	handleFile: executeHandling
};

// CODE BELOW HERE SHOULD BE ABLE TO BE DELETED
/*
function handleFile(filename) {
	return alreadyImported(filename).then(function(imported) {
		if(imported) {
			return console.log("File is already imported. Aborting.");
		} else {
			return executeHandling(filename);
		}
	});
}
*/
/*
function alreadyImported(filename) {
	return new Promise(function(resolve,reject) {
		commandDA.searchCommand({commandType:'import file', filename: filename})
			.then(function(data) {
				if(data[0]) {
					resolve(true);
				} else {
					resolve(false);
				}
		});
	});
}
*/
/*
OLD VERSION USED WITH THE VOODOOTIKIGOD NODE-CSV LIBRARY
function processFile(fileToParse) {
	dataArray = [];
	return new Promise(function(resolve,reject) {
		csv.each(fileToParse.filename, {headers: true, strDelimiter:";"})
			.on('data', function(data) {
				if(data.bedrag) {
					dataArray.push(data);	
				} else {
					console.log("The following data was not retained: " + data);
				}				
			})
			.on('end', function() {
				fileToParse.dataArray = dataArray;
				console.log("Finished processing " + fileToParse.filename + ".");
				resolve(fileToParse);
			});
	});
}
*/