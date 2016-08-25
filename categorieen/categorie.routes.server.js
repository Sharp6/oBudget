var router = require('express').Router();
var categorieCtrl = require('./categorie.controller.server');

// API ==============================================
// (= get all)
router.get('/api/categorieen', categorieCtrl.getAll);

// (=create)
router.post('/api/categorieen', categorieCtrl.create);

// (=get one)
router.get('/api/categorie/:id', categorieCtrl.get);

//(= update)
router.post('/api/categorie/:id', categorieCtrl.update);

// RENDERERS ========================================
router.get('/categorieen', categorieCtrl.renderAll);

router.get('/createCategorie', categorieCtrl.renderForm);
router.post('/createCategorie', categorieCtrl.createFormSubmit);

router.get('/categorie/:id', categorieCtrl.renderCategorie);

router.get('/editCategorie/:id', categorieCtrl.renderUpdateForm);
router.post('/editCategorie/:id', categorieCtrl.editFormSubmit);

router.get('/categorieenBoom', categorieCtrl.renderCategorieenBoom);

module.exports = router;