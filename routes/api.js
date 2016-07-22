var express = require('express');
var router = express.Router();

var verrichtingController = require('../controllers/verrichting.controller');
var bankController = require('../controllers/bank.server.controller');
var statusController = require('../controllers/status.server.controller');
var categorieController = require('../controllers/categorie.server.controller');

router.get('/verrichtingen', function(req,res) {
	return verrichtingController.getVerrichtingen(req,res);
});

router.get('/verrichtingen/:id', function(req,res) {
	return verrichtingController.getVerrichting(req,res);
});

router.put('/verrichtingen/:id', function(req,res) {
	return verrichtingController.updateVerrichting(req,res);
});

router.get('/banken', function(req,res) {
	return bankController.getBanken(req,res);
});

router.get('/statuses', function(req,res) {
	return statusController.getStatuses(req,res);
});

router.get('/categorieen', function(req,res) {
	return categorieController.getCategorieen(req,res);
});

router.get('/categorieenBoom', function(req,res) {
	return categorieController.getCategorieenBoom(req,res);
});

module.exports = router;