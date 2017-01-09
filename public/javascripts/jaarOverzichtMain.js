require.config({
	shim : {
		"hotkeys" : { "deps" : ['jquery']},
		"bootstrap" : { "deps" :['jquery'] },
		"koBindingChart" : { "deps": ['knockout', 'chartjs', 'jquery']}
	},
	paths: {
		jquery: '/libraries/jquery-2.1.3.min',
		knockout: '/libraries/knockout-3.3.0',
		bootstrap: '/libraries/bootstrap.min',
		moment: '/libraries/moment-with-locales.min',
		chartjs: '/libraries/chart.min',
		koBindingChart: '/libraries/ko.binding.chart'
	}
});

require(["jquery", "knockout", "bootstrap", "jaarOverzicht/jaarOverzicht.vm.client", "koBindingChart"],
	function($, ko, bootstrap, JaarOverzichtVM, koBindingChart) {
			// App initialization
			var jaarOverzichtVM = new JaarOverzichtVM();
			jaarOverzichtVM.init();
			ko.applyBindings(jaarOverzichtVM);
		});