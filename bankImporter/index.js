require('dotenv').config();

var fileReader = require('../fileHandler/fileReader.action');
var dataParser = require('../fileHandler/dataParser.csv.action');
var bankRepo = require('../banken/bank.repository.server');

var mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST_DEV);

var fileToParse = {
	filename: "./bankImporter/banken.csv"
};

fileReader(fileToParse)
	.then(function(fileToParse) {
		fileToParse.preparedData = fileToParse.rawData;
		return fileToParse;
	})
	.then(dataParser)
	.then(function(fileToParse) {
		var promise = Promise.resolve();
		fileToParse.dataArray.forEach(function(bank) {
			promise = promise.then(function() {
				return bankRepo.create(bank)
					.then(bankRepo.save);
			});
		});
		return promise;
	})
	.then(function() {
		mongoose.connection.close();
		console.log("All done");
	})
	.catch(function(err) {
		console.log("ERRR", err);
	});