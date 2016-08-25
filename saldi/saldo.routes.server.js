var router = require('express').Router();
var saldoCtrl = require('./saldo.controller.server');

// API ==============================================
// (= get all)
router.get('/api/saldi', saldoCtrl.getAll);

// (=create)
router.post('/api/saldi', saldoCtrl.create);

// (=get one)
router.get('/api/saldo/:id', saldoCtrl.get);

//(= update)
router.post('/api/saldo/:id', saldoCtrl.update);

// RENDERERS ========================================
router.get('/saldi', saldoCtrl.renderAll);

router.get('/createSaldo', saldoCtrl.renderForm);
router.post('/createSaldo', saldoCtrl.createFormSubmit);

router.get('/saldo/:id', saldoCtrl.renderSaldo);

router.get('/editSaldo/:id', saldoCtrl.renderUpdateForm);
router.post('/editSaldo/:id', saldoCtrl.editFormSubmit);

module.exports = router;