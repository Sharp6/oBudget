var Categorie = function(data) {
	this.naam = data.naam || "";
	this.parentCategorieNaam = data.parentCategorieNaam || "";
	this.childCategorieen = data.childCategorieen || [];

	this.isTopCategorie = function() {
		return this.parentCategorieNaam.length === 0;
	};
};

module.exports = Categorie;