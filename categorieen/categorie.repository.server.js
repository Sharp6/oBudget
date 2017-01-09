var Categorie = require('./categorie.model.server');
var categorieDA = require('./categorie.da.server');

var categorieRepo = function() {
	var _categorieen = [];

	function create(data) {
		return Promise.resolve()
			.then(function() {
				var newCategorie = new Categorie(data);
				//_categorieen.push(newCategorie);
				return newCategorie;
			});
	}

	function load(data) {
		var augmentedData = {};
    for (var dataAttribute in data) { augmentedData[dataAttribute] = data[dataAttribute]; }

		return getDirectChildren(data.naam)
			.then(function(children) {
				augmentedData.childCategorieen = children;
				var categorie = new Categorie(augmentedData);
				_categorieen.push(categorie);
				return categorie;
			});
	}

	function getAll() {
		return categorieDA.getAll()
			.then(getCategorieenByData);
	}

	function getCategorieByData(categorieData) {
		var categorie = _categorieen.find(function(categorie) {
			return categorie.naam === categorieData.naam;
		});
		if(categorie) {
			return Promise.resolve(categorie);
		} else {
			return load(categorieData);
		}
		
	}

	function getCategorieenByData(categorieenData) {
		var promises = categorieenData.map(function(categorieData) {
			return getCategorieByData(categorieData);
		});
		return Promise.all(promises);
	}

	function getCategorieByNaam(naam) {
		var categorie = _categorieen.find(function(categorie) {
			return categorie.naam === naam;
		});
		if(categorie) {
			return Promise.resolve(categorie);
		} else {
			// retrieve from db
			return categorieDA.get(naam)
				.then(load);
		}
	}

	function getDirectChildren(naam) {
		return categorieDA.search({parentCategorieNaam: naam})
			.then(getCategorieenByData);
	}

	function save(categorie) {
		return categorieDA.save(categorie)
			.then(function() {
				return categorie;
			});
	}

	function getTopLevelCategorieen() {
		return getAll()
			.then(function(categorieen) {
				return categorieen.filter(function(categorie) {
					return categorie.isTopCategorie();
				});
			});
	}

	return {
		create: create,
		getAll: getAll,
		getCategorieByNaam: getCategorieByNaam,
		save: save,
		getTopLevelCategorieen: getTopLevelCategorieen
	};
};

module.exports = new categorieRepo();