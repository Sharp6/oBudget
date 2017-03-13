"use strict";

define(['knockout', 'moment',
	'verrichtingen/verrichting.groep.client', 'verrichtingen/verrichting.model.client', 'verrichtingen/verrichting.da.client',
	'categorieen/categorie.model.client', 'categorieen/categorie.da.client'
	],
	function(ko,moment,VerrichtingGroep,Verrichting,verrichtingDA,Categorie,categorieDA) {
	var JaarOverzichtVM = function() {
		var self = this;

		self.maandMap = {
			1: "januari",
			2: "februari",
			3: "maart",
			4: "april",
			5: "mei",
			6: "juni",
			7: "juli",
			8: "augustus",
			9: "september",
			10: "oktober",
			11: "november",
			12: "december"
		};

		self.jaar = ko.observable(2016);
		self.verrichtingen = ko.observableArray([]);
		self.numberOfVerrichtingen = ko.observable();
		self.maandVerrichtingen = ko.observableArray([]);
		self.jaarVerrichtingen = ko.observableArray([]);
		self.levensVerrichtingen = ko.observableArray([]);
		ko.computed(function() {
			var mv = [];
			var jv = [];
			var lv = [];

			self.verrichtingen().forEach(function(verrichting) {
				if(verrichting.periodiciteit === "maandelijks") {
					mv.push(verrichting);
				} else if(verrichting.periodiciteit === "jaarlijks") {
					jv.push(verrichting);
				} else {
					lv.push(verrichting);
				}
			});
			self.maandVerrichtingen(mv);
			self.jaarVerrichtingen(jv);
			self.levensVerrichtingen(lv);
		});

		self.maanden = ko.observableArray([]);
		ko.computed(function() {
			var maanden = self.maandVerrichtingen()
				.reduce(function(maanden, verrichting) {
					var maand = verrichting.datum.format("M");
					var maandIndex = maand - 1;
					maanden[maandIndex] = maanden[maandIndex] || [];
					maanden[maandIndex].push(verrichting);
					return maanden;
				}, [])
				.map(function(maandVerrichtingen,idx) {
					return new VerrichtingGroep(self.maandMap[idx+1],ko.observableArray(maandVerrichtingen));
				});
			self.maanden(maanden);
		});
		self.jaarGroep = ko.computed(function() {
			return new VerrichtingGroep(self.jaar(), self.verrichtingen);
		});
		self.jaarVerrichtingenGroep = ko.computed(function() {
			return new VerrichtingGroep("Jaar-verrichtingen", self.jaarVerrichtingen);
		});
		self.levensVerrichtingenGroep = ko.computed(function() {
			return new VerrichtingGroep("Levens-verrichtingen", self.levensVerrichtingen);
		});
		self.maandelijksAandeelInJaarVerrichtingen = ko.computed(function() {
			return self.jaarVerrichtingenGroep().saldo() / 12;
		});
		self.maandSpaarSaldo = ko.computed(function() {
			return self.jaarGroep().saldo() - self.jaarVerrichtingenGroep().saldo() - self.levensVerrichtingenGroep().saldo();
		});
		self.catOverzichtPerMaand = ko.observableArray([]);
		ko.computed(function() {
			var catPerMaand = self.maanden().reduce(function(catOverzicht, maand) {
				maand.nonZeroTopLevelCategorieen().forEach(function(maandCat) {
					var catOverzichtObj = catOverzicht.find(function(cat) {
						return cat.catNaam === maandCat.naam;
					});
					if(!catOverzichtObj){
						catOverzichtObj = { catNaam: maandCat.naam, saldi: [] };
						catOverzicht.push(catOverzichtObj);
					}
					catOverzichtObj.saldi.push({ maand: maand.label, saldo: maandCat.subTotaal() });
				});
				return catOverzicht;
			}, []);
			self.catOverzichtPerMaand(catPerMaand);
		});

		self.catOverzichtForSelectedCategorie = function() {
			return self.catOverzichtPerMaand().find(function(cat) {
				return cat.catNaam === self.selectedCategorie().naam;
			});
		};

		self.selectedMaand = ko.observable();
		self.selectedCategorie = ko.observable();
		self.selectedVerrichting = ko.observable();

		self.sortVerrichtingenByBedrag = function() {
			self.verrichtingen.sort(function(a,b) {
				return Math.abs(a.bedrag) > Math.abs(b.bedrag) ? -1 : (Math.abs(a.bedrag) < Math.abs(b.bedrag) ? 1 : 0);
			});
		};

		self.filterByJaar = function() {
			var query = {
				beginDatum: moment([self.jaar(), 0]).format("DD/MM/YYYY"),
				eindDatum: moment([self.jaar(), 11]).endOf('month').format("DD/MM/YYYY")
			};
			self.filterVerrichtingen(query);
		};

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

		self.filterVerrichtingen = function(query) {
			// This function is very much like loadVerrichtingen. Should be refactored?
			//query.bank = self.bankFilter();
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

		self.init = function() {
			var query = {
				beginDatum: moment([self.jaar(), 0]).format("DD/MM/YYYY"),
				eindDatum: moment([self.jaar(), 11]).endOf('month').format("DD/MM/YYYY")
			};
			console.log("INIT QUERY", query);
			self.filterVerrichtingen(query);
		};
	};

	return JaarOverzichtVM;
});
