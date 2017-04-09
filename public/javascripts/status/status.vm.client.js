"use strict";

define(['knockout', 'moment',
	'banken/bank.model.client', 'banken/bank.da.client',
	'saldi/saldo.model.client', 'saldi/saldo.da.client'
	],
	function(ko,moment,Bank,bankDA,Saldo,saldoDA) {
	var StatusVM = function() {
		var self = this;

		self.saldi = ko.observableArray([]);
		self.banken = ko.observableArray([]);
		self.totaal = ko.computed(function() {
			return Math.round(self.banken().reduce(function(subtotaal, bank) {
				return subtotaal + bank.huidigBerekendSaldo;
			}, 0));
		});
		
		self.loadSaldi = function() {
			saldoDA.load()
				.then(function(response) {
					var mappedSaldi = response.map(function(saldo) {
						var mappedSaldo = new Saldo(saldo);

						saldoDA.verify(mappedSaldo)
							.then(outcome => {
								mappedSaldo.verified(outcome.checkResult);
							});

						return mappedSaldo;
					});
					self.saldi(mappedSaldi);
				});
		};
		self.loadBanken = function() {
			bankDA.load()
				.then(function(response) {
					var mappedBanken = response.map(function(bank) {
						return new Bank(bank);
					});
					self.banken(mappedBanken);
				});
		};

		self.init = function() {
			self.loadBanken();
			self.loadSaldi();
		};
	};
	
	return StatusVM;
});