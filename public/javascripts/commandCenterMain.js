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
		moment: '/libraries/moment-with-locales.min'
	}
});

require(["knockout", "viewmodels/commandCenter.vm.client"], function(ko, CommandCenterVM) {
	var commandCenterVm = new CommandCenterVM();
	commandCenterVm.init();
	ko.applyBindings(commandCenterVm);
});