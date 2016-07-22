//var fileHandler = require('../fileHandler');
var fs = require('fs');
//var Verrichting = require('../models/verrichting.server.model');

function loadFiles(dataDir) {
	var dir = dataDir || './dataFiles';
	// return emptyCollection()
	return listDataFiles(dir);
}

function listDataFiles(dataDir) {
	return new Promise(function(resolve,reject) {
		fs.readdir(dataDir, function(err, data) {
			if(err) {
				reject(err);
			} else {
				var selectedFiles = data.filter(function(filename) {
					if(filename.indexOf('belfius') !== -1 || filename.indexOf('argenta') !== -1 || filename.indexOf('kbc') !== -1) {
						return true;
					}
				});
				//console.log("FILESCOLLECTOR: Files to process: " + selectedFiles);
				resolve(selectedFiles);
			}
		});
	});
}

function emptyCollection() {
	return new Promise(function(resolve,reject) {
		Verrichting.remove(function(err) {
			if(err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

module.exports = {
	loadFiles: loadFiles
};

