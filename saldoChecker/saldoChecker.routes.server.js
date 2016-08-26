var router = require('express').Router();
var saldoCheckerCtrl = require('./saldoChecker.controller.server');

// API ==============================================
// (= get all)
router.get('/api/saldoChecker/:saldoId', saldoCheckerCtrl.checkSaldoFlow);

// RENDERERS ========================================
router.get('/saldoChecker', saldoCheckerCtrl.renderSaldoCheckerMain);
router.get('/saldoChecker/:saldoId', saldoCheckerCtrl.renderSaldoFlow);

module.exports = router;