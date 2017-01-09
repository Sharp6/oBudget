var router = require('express').Router();
var bulkClassifierCtrl = require('./bulkClassifier.controller.server');

router.get('/bulkClassifier', bulkClassifierCtrl.classify);

module.exports = router;