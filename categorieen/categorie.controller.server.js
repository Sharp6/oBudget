var categorieRepo = require('./categorie.repository.server');
var verrichtingRepo = require('../verrichtingen/verrichting.repository.server');
var categorieCtrl = function() {

	// API ===============================================================
	var getAll = function(req,res) {
		return categorieRepo.getAll()
			.then(function(categorieen) {
				res.send(categorieen);
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var create = function(req,res) {
		categorieRepo.create(req.body)
			.then(function(categorie){
				return getAll(req,res);
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var update = function(req,res) {

	};

	var get = function(req,res) {
		return categorieRepo.getCategorieByNaam(req.params.id)
			.then(function(categorie) {
				return res.send(categorie);
			})
			.catch(function(err) {
				return res.status(500).send(err);
			});
	};

	// Renderers ==========================================================
	var renderAll = function(req,res) {
		return categorieRepo.getAll()
			.then(function(categorieen) {
				return res.render('categorieen/categorieen', {
					categorieen: categorieen
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var renderForm = function(req,res) {
		return res.render('categorieen/createCategorieForm');
	};

	var renderUpdateForm = function(req,res) {
		return categorieRepo.getCategorieByNaam(req.params.id)
			.then(function(categorie) {
				return res.render('categorieen/editCategorieForm', {
					categorie: categorie
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var renderCategorie = function(req,res) {
		return Promise.all([
			categorieRepo.getCategorieByNaam(req.params.id),
			verrichtingRepo.findVerrichtingenWithCategorie(req.params.id)
		])
			.then(function(results) {
				res.render('categorieen/categorie', {
					categorie: results[0],
					verrichtingen: results[1]
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var createFormSubmit = function(req,res) {
		return categorieRepo.create(req.body)
			.then(categorieRepo.save)
			.then(function(categorie) {
				res.render('categorieen/categorie', {
					categorie: categorie
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var editFormSubmit = function(req,res) {
		return categorieRepo.getCategorieByNaam(req.params.id)
			.then(function(categorie) {
				categorie.parentCategorieNaam = req.body.parentCategorieNaam;
				return categorie;
			})
			.then(categorieRepo.save)
			.then(function(categorie) {
				res.render('categorieen/categorie', {
					categorie: categorie
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	var renderCategorieenBoom = function(req,res) {
		return categorieRepo.getTopLevelCategorieen()
			.then(function(rootCategorieen) {
				console.log("ROOTS", rootCategorieen);
				res.render('categorieen/categorieenBoom', {
					topLevelCategorieen: rootCategorieen
				});
			})
			.catch(function(err) {
				res.status(500).send(err);
			});
	};

	return {
		getAll: getAll,
		create: create,
		get: get,
		update: update,
		renderAll: renderAll,
		renderForm: renderForm,
		renderUpdateForm: renderUpdateForm,
		renderCategorie: renderCategorie,
		createFormSubmit: createFormSubmit,
		editFormSubmit: editFormSubmit,
		renderCategorieenBoom: renderCategorieenBoom
	};
};

module.exports = new categorieCtrl();