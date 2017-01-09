require('dotenv').config();

var fileReader = require('../fileHandler/fileReader.action');
var dataParser = require('../fileHandler/dataParser.csv.action');
var catRepo = require('../categorieen/categorie.repository.server');

var mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST_DEV);

var fileToParse = {
	filename: "./categorieImporter/categorieen.csv"
};

fileReader(fileToParse)
	.then(function(fileToParse) {
		fileToParse.preparedData = fileToParse.rawData;
		return fileToParse;
	})
	.then(dataParser)
	.then(function(fileToParse) {
		console.log(fileToParse.dataArray);
		var promise = Promise.resolve();
		fileToParse.dataArray.forEach(function(cat) {
			promise = promise.then(function() {
				return catRepo.create(cat)
					.then(catRepo.save);
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