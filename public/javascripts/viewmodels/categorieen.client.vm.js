define(['knockout', 'models/categorie.client.model', 'da/misc.client.da'], function(ko,Categorie,miscDA) {
	var categorieenVM = function() {
		var self = this;
		
		self.categorieen = ko.observableArray([]);

		self.loadCategorieen = function() {
			miscDA.loadCategorieen()
				.then(function(results) {
					/*
					var mappedCategorieen = results.map(function(categorie) {
						return new Categorie(categorie);
					});
					self.categorieen(mappedCategorieen);
					*/
					results.forEach(function(categorieData) {
						var retrievedCat = retrieveCategory(categorieData);
						if(categorieData.parent) {
							var retrievedParent = retrieveCategory(categorieData.parent);
							retrievedParent.childrenCategories.push(retrievedCat);
							retrievedCat.parentCategorie(retrievedParent);
						}
					});
				});
		}

		function retrieveCategory(categorieData) {
			var retrievedCat = ko.utils.arrayFirst(self.categorieen(), function(catInArray) {
				return catInArray.naam() === categorieData.naam;
			});
			if(retrievedCat) {
				return retrievedCat;
			} else {
				var newCat = new Categorie(categorieData);
				self.categorieen.push(newCat);
				return newCat;
			}
		}

		self.init = function() {
			self.loadCategorieen();
		};
	};
	
	return categorieenVM;
});