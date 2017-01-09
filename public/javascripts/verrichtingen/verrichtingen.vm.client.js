define(['knockout', 'moment',
	'verrichtingen/verrichting.model.client', 'verrichtingen/verrichting.da.client',
	'categorieen/categorie.model.client', 'categorieen/categorie.da.client'
	],
	function(ko,moment,Verrichting,verrichtingDA,Categorie,categorieDA) {
	var verrichtingenVM = function() {
		var self = this;
		
		self.verrichtingen = ko.observableArray([]);
		self.categorieen = ko.observableArray([]);
		self.topLevelCategorieen = ko.observableArray([]);
		ko.computed(function() {
			self.topLevelCategorieen(self.categorieen().filter(function(categorie) {
				return categorie.isTopLevel;
			}));
		});
		self.nonZeroTopLevelCategorieen = ko.observableArray([]);
		ko.computed(function() {
			self.nonZeroTopLevelCategorieen(self.categorieen().filter(function(categorie) {
				return categorie.isTopLevel && categorie.subTotaal() !== 0;
			}));
		});
		self.nonZeroTopLevelCostCategorieen = ko.observableArray([]);
		ko.computed(function() {
			self.nonZeroTopLevelCostCategorieen(self.nonZeroTopLevelCategorieen().filter(function(categorie) {
				return categorie.naam !== "Inkomsten";
			}));
		});

		self.saldo = ko.computed(function() {
			return self.verrichtingen().reduce(function(saldo, verrichting) {
				return Math.round(saldo + verrichting.bedrag);
			}, 0);
		});

		self.selectedCategorie = ko.observable();
		self.selectedVerrichting = ko.observable();
		
		self.bankFilter = ko.observable('');
		self.beginDatumFilter = ko.observable('');
		self.eindDatumFilter = ko.observable('');
		//self.periodiciteitFilter = ko.observable(false);

		self.jaar = ko.observable(2016);
		self.maand = ko.observable(1);
		self.maandBegin = ko.computed(function() {
			return moment([self.jaar(), self.maand()]).add(-1,"month").format("DD/MM/YYYY");
		});
		self.maandEinde = ko.computed(function() {
			return moment([self.jaar(), self.maand()]).add(-1,"month").endOf('month').format("DD/MM/YYYY");
		});

		self.numberOfVerrichtingen = ko.observable();
		
		self.loadVerrichtingen = function() {
			verrichtingDA.load()
				.then(function(response) {
					var mappedVerrichtingen = response.verrichtingen.map(function(verrichting) {
						return new Verrichting(verrichting);
					});
					self.verrichtingen(mappedVerrichtingen);
					self.numberOfVerrichtingen(response.count);
			});
		};

		self.loadCategorieen = function() {
			categorieDA.load()
				.then(function(results) {
					var mappedCategorieen = results.map(function(categorie) {
						return new Categorie(categorie, self.verrichtingen, self.categorieen);
					});
					self.categorieen(mappedCategorieen);

					var geenCategorie = new Categorie({ naam: 'Geen categorie', parentCategorieNaam: '' }, self.verrichtingen, self.categorieen);
					self.categorieen.push(geenCategorie);
				});
		};

		self.sortCategorieenBySubtotaal = function() {
			self.categorieen.sort(function(a,b) {
				return b.subTotaalAbs() - a.subTotaalAbs();
			});
		};

		self.sortVerrichtingenByBedrag = function() {
			self.verrichtingen.sort(function(a,b) {
				return Math.abs(a.bedrag) > Math.abs(b.bedrag) ? -1 : (Math.abs(a.bedrag) < Math.abs(b.bedrag) ? 1 : 0);
			});
		};

		self.filterByMaand = function() {
			var query = {
				beginDatum: self.maandBegin(),
				eindDatum: self.maandEinde()
			};
			self.filterVerrichtingen(query);
		};

		self.filterByJaar = function() {
			var query = {
				beginDatum: moment([self.jaar(), 0]).format("DD/MM/YYYY"),
				eindDatum: moment([self.jaar(), 11]).endOf('month').format("DD/MM/YYYY")
			};
			self.filterVerrichtingen(query);
		};
		
		self.filterVerrichtingen = function(query) {
			// This function is very much like loadVerrichtingen. Should be refactored?
			query.bank = self.bankFilter();
			//query.periodiciteit = self.periodiciteitFilter();
			verrichtingDA.loadWithFilter(query)
				.then(function(response) {
					var mappedVerrichtingen = response.verrichtingen.map(function(verrichting) {
						return new Verrichting(verrichting);
					});
					self.verrichtingen(mappedVerrichtingen);
					self.numberOfVerrichtingen(response.count);
				});
		};
		/*
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
		*/

		self.init = function() {
			self.loadVerrichtingen();
			self.loadCategorieen();
		};
	};
	
	return verrichtingenVM;
});