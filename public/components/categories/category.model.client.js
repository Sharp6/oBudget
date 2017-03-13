define(['knockout'], function(ko) {
	var Category = function(data) {
    this.naam = data.naam;
    this.kleur = data.kleur;
    this.parentCategorieNaam = data.parentCategorieNaam;

    this.isTopLevel = (this.parentCategorieNaam === '');
    this.childCategories = ko.observableArray([]);
    this.showChildCategories = ko.observable(false);
  };

  Category.prototype.toggleChildren = function() {
    this.showChildCategories(!this.showChildCategories());
  }

  return Category;
});
