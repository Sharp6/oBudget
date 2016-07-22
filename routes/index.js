var express = require('express');
var router = express.Router();

var fc = require('../filesCollector');
var categorizer = require('../categorizer');
var classifier = require('../classifier');

var workflowLoad = require('../workflows/loader');

var partials = {
	header:'partials/header',
	footer:'partials/footer'
}

/* UI routes */
router.get('/', function(req, res) {
  res.render('index', { title: 'Phinances', partials:partials });
});
router.get('/home', function(req, res) {
  res.render('index', { title: 'Phinances', partials:partials });
});

router.get('/verrichtingen', function(req,res) {
	res.render('verrichtingen', {partials: partials});
});

router.get('/categorieen', function(req,res) {
	res.render('categorieen', {partials: partials});
});

router.get('/commandCenter', function(req,res) {
	res.render('commandCenter', {partials: partials});
});

/* Workflow functionality */
router.get('/workflowLoad', function(req,res) {
	workflowLoad.load()
		.then(function() {
			res.json("ok");
		})
		.catch(function(err) {
			res.json("ERROR: " + err); 
		});
});

/* Raw functionality */
router.get('/loadVerrichtingen', function(req,res) {
	fc.loadFiles()
		.then(function() {
			res.render('verrichtingen');
		})
		.catch(function(error) {
			console.log("This error: " + error + " at stack " + error.stack);
		});
});

router.get('/checkForDuplicates', function(req,res) {
	categorizer.checkForDuplicates()
		.then(function(results) {
			res.json(results);
		})
		.catch(function(err) {
			console.log(err);
		});
});

router.get('/classify', function(req,res) {
	classifier.classify()
		.then(function() {
			res.json("Classification complete.");
		})
		.catch(function(err) {
			res.json(err);
		});
});

module.exports = router;
