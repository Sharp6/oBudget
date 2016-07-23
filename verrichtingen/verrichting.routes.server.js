var verrichtingCtrl = require('./verrichting.controller.server');

function verrichtingRoutes(app) {
	app.get('/verrichtingen', verrichtingCtrl.getVerrichtingen);
	
	/*
	app.get('/songs/:id', passport.authenticationMiddleware(), songsCtrl.getSong);
	app.post('/songs/:id', passport.authenticationMiddleware(), songsCtrl.updateSong);
	
	app.get('/addSong', passport.authenticationMiddleware(), songsCtrl.showNewSongForm);
	app.post('/addSong', passport.authenticationMiddleware(), songsCtrl.addNewSong);
	*/
}

module.exports = verrichtingRoutes;