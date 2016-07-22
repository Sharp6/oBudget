var filesCollector = require('../filesCollector');
var fileHandler = require('../fileHandler');
var categorizer = require('../categorizer');
var classifier = require('../classifier');

function load() {
	return filesCollector.loadFiles()
		// .then(createCommands) <-- if a file is already handled, no command should be created. Output is an array of commands.
		.then(processListOfFiles) // <-- is this a command bus? Handles one command after another, sequential execution. 
		.then(categorizer.checkForDuplicates)
		.then(classifier.classify);
}

function processListOfFiles(fileList) {
	// THIS IS THE SEQUENTIAL EXECUTION
	// BASED ON NODE.JS DESIGN PATTERNS, p. 96-97
	return new Promise(function(resolve,reject) {
		var promise = Promise.resolve();
		fileList.forEach(function(file) {
			// First, it should be checked if a file has already been handled.
			// Therefore, it seems that we should create commands here
			promise = promise.then(function() {
				console.log("Commanding processing of file " + file);
				return fileHandler.handleFile('./dataFiles/' + file);
			});
		});
		promise.then(function() {
			resolve();
		})
		.catch(function(err) {
			reject(err);
		});
	});
}

module.exports = {
	load: load
};