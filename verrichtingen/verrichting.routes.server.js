var router = require('express').Router();
var verrichtingCtrl = require('./verrichting.controller.server');

// API ==============================================
// (= get all)
router.get('/api/verrichtingen', verrichtingCtrl.getAll);

// (=get one)
router.get('/api/verrichting/:id', verrichtingCtrl.get);

// RENDERERS ========================================
router.get('/verrichtingen', verrichtingCtrl.renderAll);

router.get('/verrichting/:id', verrichtingCtrl.renderVerrichting);

module.exports = router;
