require.config({
	shim : {
		"hotkeys" : { "deps" : ['jquery']},
		"bootstrap" : { "deps" :['jquery'] },
		"typeahead" : { "deps" : ['bootstrap']},
		"binding-typeahead" : { "deps": ['bootstrap']}
	},
	paths: {
		jquery: '/libraries/jquery-2.1.3.min',
		knockout: '/libraries/knockout-3.3.0',
		bootstrap: '/libraries/bootstrap.min',
		moment: '/libraries/moment-with-locales.min',
		typeahead: '/libraries/bootstrap3-typeahead.min',
		'binding-typeahead': '/libraries/binding-typeahead',
		hotkeys: '/libraries/jquery.hotkeys'
	}
});

require(["jquery", "hotkeys", "knockout", "bootstrap", "typeahead", "binding-typeahead", "viewmodels/verrichtingen.client.vm"], 
	function($, hotkeys, ko, bootstrap, typeahead, bindingTypeahead, VerrichtingenVM) {
			// App initialization
			var verrichtingenVm = new VerrichtingenVM();
			verrichtingenVm.init();
			ko.applyBindings(verrichtingenVm);

			// UI specifics
			$.hotkeys.options.filterInputAcceptingElements = false;
			$.hotkeys.options.filterContentEditable = false;
			$.hotkeys.options.filterTextInputs = false;

			$(document).bind('keydown', 'alt+ctrl+c', function() {
				$('#verrichtingCategorieText').focus();
			});

			$(document).bind('keydown', 'alt+ctrl+n', function() {
				verrichtingenVm.increaseSelectedVerrichting();
			});

			$(document).bind('keydown', 'alt+ctrl+p', function() {
				verrichtingenVm.decreaseSelectedVerrichting();
			});

			$(document).bind('keydown', 'alt+ctrl+s', function() {
				verrichtingenVm.selectedVerrichting().save();
			});

			$(document).bind('keydown', 'alt+ctrl+b', function() {
				verrichtingenVm.selectedVerrichting().accepteerCategorieGuessedByBusinessRule();
			});

			$(document).bind('keydown', 'alt+ctrl+m', function() {
				verrichtingenVm.selectedVerrichting().accepteerCategorieGuessedByMachine();
			});
		});