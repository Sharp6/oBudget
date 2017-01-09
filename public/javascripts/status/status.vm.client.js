"use strict";

define(['knockout', 'moment',
	'banken/bank.model.client', 'banken/bank.da.client'
	],
	function(ko,moment,Bank,bankDA) {
	var StatusVM = function() {
		var self = this;

		self.banken = ko.observableArray([]);
		self.totaal = ko.computed(function() {
			return Math.round(self.banken().reduce(function(subtotaal, bank) {
				return subtotaal + bank.huidigBerekendSaldo;
			}, 0));
		});
		
		self.loadBanken = function() {
			bankDA.load()
				.then(function(response) {
					var mappedBanken = response.map(function(bank) {
						return new Bank(bank);
					});
					self.banken(mappedBanken);
					self.numberOfVerrichtingen(response.count);
			});
		};

		self.init = function() {
			self.loadBanken();
		};
	};
	
	return StatusVM;
});