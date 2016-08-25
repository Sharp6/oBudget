var router = require('express').Router();
var bankCtrl = require('./bank.controller.server');

// API ==============================================
// (= get all)
router.get('/api/banken', bankCtrl.getAll);

// (=create)
router.post('/api/banken', bankCtrl.create);

// (=get one)
router.get('/api/bank/:id', bankCtrl.get);

//(= update)
router.post('/api/bank/:id', bankCtrl.update);

// RENDERERS ========================================
router.get('/banken', bankCtrl.renderAll);

router.get('/createBank', bankCtrl.renderForm);
router.post('/createBank', bankCtrl.createFormSubmit);

router.get('/bank/:id', bankCtrl.renderBank);

router.get('/editBank/:id', bankCtrl.renderUpdateForm);
router.post('/editBank/:id', bankCtrl.editFormSubmit);

module.exports = router;