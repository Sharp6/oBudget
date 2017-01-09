define(['knockout', 'moment',
	'verrichtingen/verrichting.model.client', 'verrichtingen/verrichting.da.client',
	'categorieen/categorie.model.client', 'categorieen/categorie.da.client'
	],
	function(ko,moment,Verrichting,verrichtingDA,Categorie,categorieDA) {
	var VerrichtingenGroep = function(label, verrichtingen) {
		var self = this;

		self.label = label;
		
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
		self.totaleKosten = ko.computed(function() {
			return self.nonZeroTopLevelCostCategorieen().reduce(function(kosten, kostCategorie) {
				return Math.round(kosten + kostCategorie.subTotaal());
			}, 0);
		});
		self.totaleInkomsten = ko.computed(function() {
			return self.categorieen().reduce(function(inkomsten, cat) {
				if(cat.naam === "Inkomsten") {
					inkomsten += cat.subTotaal();
				}
				return inkomsten;
			}, 0);
		});

		self.saldoKleur = ko.computed(function() {
			return (self.saldo() > 0 ? "#1CFF7C" : "#FF292B");
		});
		
		self.loadCategorieen = function() {
			categorieDA.load()
				.then(function(results) {
					var mappedCategorieen = results.map(function(categorie) {
						return new Categorie(categorie, self.verrichtingen, self.categorieen);
					});
					self.categorieen(mappedCategorieen);

					var geenCategorie = new Categorie({ naam: 'Geen categorie', parentCategorieNaam: '' }, self.verrichtingen, self.categorieen);
					self.categorieen.push(geenCategorie);

					self.sortCategorieenBySubtotaal();
				});
		};

		self.sortCategorieenBySubtotaal = function() {
			self.categorieen.sort(function(a,b) {
				return b.subTotaalAbs() - a.subTotaalAbs();
			});
		};

		self.init = function(verrichtingen) {
			self.verrichtingen(verrichtingen());
			self.loadCategorieen();
		};

		self.init(verrichtingen);
	};
	
	return VerrichtingenGroep;
});