define(['knockout'], function(ko) {
	var categorieModel = function(data) {
		var self = this;

		self.naam = ko.observable(data.naam);
		self.databaseId = ko.observable(data._id);

		self.parentCategorie = ko.observable();
		self.childrenCategories = ko.observableArray([]);

		self.topLevelCategorie = ko.computed(function() {
			if(self.parentCategorie()) {
				return false;
			} else {
				return true;
			}
		})
	};

	
	return categorieModel;
});