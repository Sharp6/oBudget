define(['knockout'], function(ko) {
	var categorieModel = function(data, allVerrichtingen, allCategorieen) {
		var self = this;

		self.allVerrichtingen = allVerrichtingen;
		self.allCategorieen = allCategorieen;

		self.naam = data.naam;
		self.kleur = data.kleur;
		self.parentCategorieNaam = data.parentCategorieNaam;

		self.isTopLevel = (self.parentCategorieNaam === '');

		self.childCategorieen = ko.observableArray([]);
		ko.computed(function() {
			self.childCategorieen(self.allCategorieen().filter(function(aCat) {
				return aCat.parentCategorieNaam === self.naam;
			}));
		});

		self.categorieVerrichtingen = ko.observableArray([]);
		ko.computed(function() {
			self.categorieVerrichtingen(self.allVerrichtingen().filter(function(verrichting) {
				return verrichting.categorie === self.naam || (self.naam === "Geen categorie" && verrichting.categorie === '');
			}));
		});
		self.aantalVerrichtingen = ko.computed(function() {
			return self.categorieVerrichtingen().length;
		});
		self.categorieTotaal = ko.computed(function() {
			return self.categorieVerrichtingen().reduce(function(totaal,verrichting) {
				return Math.round(totaal + verrichting.bedrag);
			}, 0);
		});

		self.categorieVerrichtingenIncludingChildCategorieen = ko.computed(function() {
			return self.childCategorieen().reduce(function(verrinchtingenIncludingChildren, childCat) {
				return verrinchtingenIncludingChildren.concat(childCat.categorieVerrichtingenIncludingChildCategorieen());
			}, self.categorieVerrichtingen());
		});

		self.subTotaal = ko.computed(function() {
			return self.childCategorieen().reduce(function(totaal,childCat) {
				return totaal + childCat.subTotaal();
			}, self.categorieTotaal());
		});

		self.subTotaalAbs = ko.computed(function() {
			return Math.abs(self.subTotaal());
		});
		self.isNegative = ko.computed(function() {
			return self.subTotaal() < 0;
		});
	};
	
	return categorieModel;
});