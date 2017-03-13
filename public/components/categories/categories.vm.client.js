"use strict";

define(['knockout', 'moment', './category.model.client.js'], function(ko,moment, Category) {
	var CategoriesVM = function(params) {
		this.selectedCategory = params.value;
    this.allCategories = ko.observableArray([]);
    this.topLevelCategories = ko.computed(function() {
      return this.allCategories().filter(function(cat) {
        return cat.isTopLevel;
      });
    }.bind(this));

    this.loadCategories = function() {
      $.getJSON("/api/categorieen", function(result) {
        var mappedCategories = result
          .map(function(data) {
            return new Category(data);
          });
        mappedCategories.forEach(function(cat, index, allCats) {
          if(cat.parentCategorieNaam) {
            var parent = allCats.find(function(aCat) {
              return aCat.naam === cat.parentCategorieNaam;
            });
            parent.childCategories.push(cat);
          }
        });
        this.allCategories(mappedCategories);
      }.bind(this));
    }

		this.init = function() {
      this.loadCategories();
		}.bind(this);

		this.init();
	};

	return CategoriesVM;
});
