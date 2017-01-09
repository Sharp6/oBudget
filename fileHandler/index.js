var moment = require('moment');

// actions
var determineBank = require('./bankDeterminer.action');
var assignDataHelpers = require('./dataHelpersAssigner.action');
var readFile = require('./fileReader.action');
var parseData = require('./dataParser.csv.action');
var fixSyntax = require('./syntaxFixer.action');
var createVerrichtingen = require('./verrichtingenCreator.action');
var saveVerrichtingen = require('./verrichtingenSaver.action');

function executeHandling(filename) {
	var fileToParse = {
		filename: filename
	};

	return determineBank(fileToParse)
		.then(assignDataHelpers)
		.then(readFile)
		.then(function(fileToParse) {
			return fileToParse.dataPreparer(fileToParse);
		})
		.then(function(fileToParse) {
			console.log(fileToParse);
			return fileToParse;
		})
		//.then(parseData)
		.then(function(fileToParse) {
			return fileToParse.dataParser(fileToParse);
		})
		.then(function(fileToParse) {
			return fileToParse.dataMapper(fileToParse);
		})
		.then(fixSyntax)
		.then(createVerrichtingen)
		.then(saveVerrichtingen);
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