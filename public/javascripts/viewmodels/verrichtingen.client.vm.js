define(['knockout', 'models/verrichting.client.model', 'da/verrichting.client.da', 'da/misc.client.da'], function(ko,Verrichting,verrichtingDA,miscDA) {
	var verrichtingenVM = function() {
		var self = this;
		self.verrichtingen = ko.observableArray([]);
		self.banken = ko.observableArray([]);
		self.statuses = ko.observableArray([]);
		self.categorieen = ko.observableArray([]);

		self.categorieFilter = ko.observable('');
		self.statusFilter = ko.observable('');
		self.bankFilter = ko.observable('');
		self.beginDatum = ko.observable('');
		self.eindDatum = ko.observable('');
		self.limitFilter = ko.observable('');
		self.skipFilter = ko.observable('');
		self.businessRuleClassificationFilter = ko.observable(false);

		self.selectedVerrichting = ko.observable();
		self.selectedVerrichtingIndex = ko.computed(function() {
			return self.verrichtingen().indexOf(self.selectedVerrichting());
		});
		self.numberOfVerrichtingen = ko.observable();
		
		self.loadVerrichtingen = function() {
			verrichtingDA.load()
				.then(function(response) {
					var mappedVerrichtingen = response.results.map(function(verrichting) {
						return new Verrichting(verrichting); 
					});
					self.verrichtingen(mappedVerrichtingen);	
					self.numberOfVerrichtingen(response.count);
					self.selectedVerrichting(self.verrichtingen()[0]);
			});
		};

		self.loadBanken = function() {
			miscDA.loadBanken()
				.then(function(results) {
					var mappedBanken = results.map(function(bank) {
						return bank.naam;
					});
					self.banken(mappedBanken);
				});
		}

		self.loadStatuses = function() {
			miscDA.loadStatuses()
				.then(function(results) {
					var mappedStatuses = results.map(function(status) {
						return status.naam;
					});
					self.statuses(mappedStatuses);
				});
		}

		self.loadCategorieen = function() {
			miscDA.loadCategorieen()
				.then(function(results) {
					var mappedCategorieen = results.map(function(categorie) {
						return categorie.naam;
					});
					self.categorieen(mappedCategorieen);
				});
		}

		self.filterVerrichtingen = function() {
			// This function is very much like loadVerrichtingen. Should be refactored?
			var query = {
				beginDatum: self.beginDatum,
				eindDatum: self.eindDatum,
				bank: self.bankFilter,
				status: self.statusFilter,
				categorie: self.categorieFilter,
				skip: self.skipFilter,
				limit: self.limitFilter,
				businessRuleClassification: self.businessRuleClassificationFilter
			};
			verrichtingDA.loadWithFilter(query)
				.then(function(response) {
					var mappedVerrichtingen = response.results.map(function(verrichting) {
						return new Verrichting(verrichting);
					});
					self.verrichtingen(mappedVerrichtingen);
					self.numberOfVerrichtingen(response.count);
				});
		};

		self.increaseSelectedVerrichting = function() {
			if(self.selectedVerrichtingIndex() < self.verrichtingen().length - 1) {
				self.selectedVerrichting(self.verrichtingen()[self.selectedVerrichtingIndex() + 1]);
			}
		};

		self.decreaseSelectedVerrichting = function() {
			if(self.selectedVerrichtingIndex() > 0) {
				self.selectedVerrichting(self.verrichtingen()[self.selectedVerrichtingIndex() - 1]);
			}
		};

		self.init = function() {
			self.loadVerrichtingen();
			self.loadBanken();
			self.loadStatuses();
			self.loadCategorieen();
		};
	};
	
	return verrichtingenVM;
});