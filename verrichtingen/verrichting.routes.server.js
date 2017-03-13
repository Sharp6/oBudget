var router = require('express').Router();
var verrichtingCtrl = require('./verrichting.controller.server');

// API ==============================================
// (= get all)
router.get('/api/verrichtingen', verrichtingCtrl.getMultiple);

// (=get one)
router.get('/api/verrichting/:id', verrichtingCtrl.get);

router.get('/api/checkDuplicateVerrichtingen/:csum', verrichtingCtrl.checkDuplicates);
router.get('/api/checkAllDuplicateVerrichtingen', verrichtingCtrl.checkAllDuplicates);

router.get('/api/actions/getTimeExtremes', verrichtingCtrl.getTimeExtremes)
// RENDERERS ========================================
router.get('/verrichtingen', verrichtingCtrl.renderAll);
router.get('/verrichting/:id', verrichtingCtrl.renderVerrichting);
router.get('/verrichtingHelpers', verrichtingCtrl.renderHelpers);
router.post('/verrichting/:id', verrichtingCtrl.editFormSubmit);
router.get('/searchVerrichtingen', verrichtingCtrl.renderSearch);

module.exports = router;
