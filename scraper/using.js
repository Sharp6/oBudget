var scraper = require("./index");
var reader = require('./../fileHandler/fileReader.action');

var fileToParse = {
	filename: "../dataFiles/kbcvisa.txt"
};

reader(fileToParse)
	.then(scraper)
	.then(function(fileToParse) {
		console.log("data", fileToParse.parsedData[0]);
	});
