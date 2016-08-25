var mongoose = require('mongoose');

var CategorieDA = function() {
	var categorieSchema = new mongoose.Schema({
		naam: String,
		parentCategorieNaam: String
	});

	var CategorieModel = mongoose.model('Categorie', categorieSchema);

	function getAll() {
		return new Promise(function(resolve,reject) {
			CategorieModel.find().exec(function(err, doc) {
				if(err) {
					return reject(err);
				} else {
					resolve(doc);
				}
			});
		});
	}

	function get(naam) {
		return new Promise(function(resolve,reject) {
			CategorieModel.find({naam: naam}, function(err,result) {
				if(err) {
					return reject(err);
				} else {
					resolve(result[0]);
				}
			});
		});
	}

	function removeAll() {
		return new Promise(function(resolve,reject) {
			CategorieModel.remove({}, function(err,result) {
				if(err) {
					return reject(err);
				}
				return resolve(result);
			});
		});
	}

	function remove(categorie) {
		return new Promise(function(resolve,reject) {
			CategorieModel.remove({ naam: categorie.naam }, function(err,result) {
				if(err) {
					return reject(err);
				}
				return resolve(result);
			});
		});
	}

	function save(categorie) {
		return new Promise(function(resolve,reject) {
			CategorieModel.findOne({ naam: categorie.naam }).exec(function(err,doc) {
				if(err) {
					reject(err);
					return;
				}
				if(doc) {
					resolve(doc);
				} else {
					var categorieModel = new CategorieModel({});
					resolve(categorieModel);
				}
			});
		})
		.then(function(categorieModel) {
			return new Promise(function(resolve,reject) {
				categorieModel.naam = categorie.naam;
				categorieModel.parentCategorieNaam = categorie.parentCategorieNaam;
				
				categorieModel.save(function (err) {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
		});
	}

	function search(queryParams) {
		return new Promise(function(resolve,reject) {
			var queryCriteria = [];
			if(queryParams.parentCategorieNaam && queryParams.parentCategorieNaam !== "undefined") {
				queryCriteria.push({parentCategorieNaam: queryParams.parentCategorieNaam});
			}

			var queryObject = {};
			if(queryCriteria.length > 0) {
				queryObject.$and = queryCriteria;
			}

			var query = CategorieModel.find(queryObject);
			//var query = CategorieModel.find({parentCategorieNaam: queryParams.parentCategorieNaam});

			query.exec(function(err,result) {
				if(err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}

	return {
		save: save,
		get: get,
		getAll: getAll,
		removeAll: removeAll,
		remove: remove,
		search: search
	};
};

module.exports = new CategorieDA();