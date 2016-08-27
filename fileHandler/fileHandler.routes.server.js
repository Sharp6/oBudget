var router = require('express').Router();
var fileHandlerCtrl = require('./fileHandler.controller.server');

// API ==============================================
// (= get all)
//router.get('/api/saldoChecker/:saldoId', saldoCheckerCtrl.checkSaldoFlow);

// RENDERERS ========================================
router.get('/fileHandler', fileHandlerCtrl.renderFileHandlerMain);
router.post('/fileHandler', fileHandlerCtrl.handleFile);

module.exports = router;