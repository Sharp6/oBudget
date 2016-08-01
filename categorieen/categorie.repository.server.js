var Categorie = require('./categorie.model.server');
var categorieDA = require('./categorie.da.server');

var categorieRepo = function() {
	var _categorieen = [];

	function create(data) {
		var newCategorie = new Categorie(data);
		_categorieen.push(newCategorie);
		return newCategorie;
	}

	function getAll() {
		return categorieDA.getAll()
			.then(function(categorieenData) {
				var promises = categorieenData.map(function(categorieData) {
					return getCategorieByData(categorieData);
				});
				return Promise.all(promises);
			});
	}

	function getCategorieByData(categorieData) {
		return new Promise(function(resolve,reject) {
			var categorie = _categorieen.find(function(categorie) {
				return categorie.naam === categorieData.naam;
			});
			if(categorie) {
				resolve(categorie);
			} else {
				var newCategorie = new Categorie(categorieData);
				_categorieen.push(newCategorie);
				resolve(newCategorie);
			}
		});
	}

	function getCategorieByNaam(naam) {
		return new Promise(function(resolve,reject) {
			var categorie = _categorieen.find(function(categorie) {
				return categorie.naam === naam;
			});
			if(categorie) {
				resolve(categorie);
			} else {
				// retrieve from db
				categorieDA.get(categorie)
					.then(function(categorieData) {
						var newCategorie = new Categorie(categorieData);
						_categorieen.push(newCategorie);
						resolve(newCategorie);
					})
					.catch(function(err) {
						reject(err);
					});
			}
		});
	}

	function save(categorie) {
		return categorieDA.save(categorie);
	}

	return {
		create: create,
		getAll: getAll,
		getCategorieByNaam: getCategorieByNaam,
		save: save
	};
};

module.exports = new categorieRepo();