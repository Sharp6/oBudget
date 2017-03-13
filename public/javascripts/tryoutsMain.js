require.config({
	shim : {
		"hotkeys" : { "deps" : ['jquery']},
		"bootstrap" : { "deps" :['jquery'] },
		"koBindingChart" : { "deps": ['knockout', 'chartjs', 'jquery']},
		"components" : { "deps": ['knockout', 'jquery']}
	},
	paths: {
		jquery: '/libraries/jquery-2.1.3.min',
		knockout: '/libraries/knockout-3.3.0',
		bootstrap: '/libraries/bootstrap.min',
		moment: '/libraries/moment-with-locales.min',
		chartjs: '/libraries/chart.min',
		koBindingChart: '/libraries/ko.binding.chart',
		components: '/components/init',
		text: '/libraries/text'
	}
});

require(["jquery", "knockout", "bootstrap", "koBindingChart", "components"],
	function($, ko, bootstrap, koBindingChart, components) {
		pageModel = {
			selectedYear: ko.observable()
		};
		ko.applyBindings(pageModel);
	});
