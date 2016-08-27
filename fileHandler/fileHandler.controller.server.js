var fileHandler = require('./index');

var fileHandlerCtrl = function() {
	function handleFile(req,res) {
		//fileHandler.handleFile(req.body.filename);
		if(!req.files.fileToHandle) {
			return res.status(500).send('Something went wrong with the file upload.');
		}

		req.files.fileToHandle.mv('./dataFiles/' + req.files.fileToHandle.name, function(err) {
			if(err) {
				return res.status(500).send(err);
			} else {
				fileHandler.handleFile('./dataFiles/' + req.files.fileToHandle.name)
					.then(function() {
						res.send("All seems ok");
					})
					.catch(function(err) {
						res.status(500).send(err);
					});
			}
		});
	}

	function renderFileHandlerMain(req,res) {
		res.render('fileHandler/main');
	}

	return {
		handleFile: handleFile,
		renderFileHandlerMain: renderFileHandlerMain
	};
};

module.exports = new fileHandlerCtrl();