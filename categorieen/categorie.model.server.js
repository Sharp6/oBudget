var Categorie = function(data) {
	this.naam = data.naam || "";
	this.parentCategorie = data.parentCategorie || "";
};

module.exports = Categorie;