var router = require('express').Router();
var verrichtingCtrl = require('./verrichting.controller.server');

// API ==============================================
// (= get all)
router.get('/api/verrichtingen', verrichtingCtrl.getAll);

// (=get one)
router.get('/api/verrichting/:id', verrichtingCtrl.get);

router.get('/api/checkDuplicateVerrichtingen/:csum', verrichtingCtrl.checkDuplicates);
router.get('/api/checkAllDuplicateVerrichtingen', verrichtingCtrl.checkAllDuplicates);
// RENDERERS ========================================
router.get('/verrichtingen', verrichtingCtrl.renderAll);

router.get('/verrichting/:id', verrichtingCtrl.renderVerrichting);

router.get('/verrichtingHelpers', verrichtingCtrl.renderHelpers);

module.exports = router;