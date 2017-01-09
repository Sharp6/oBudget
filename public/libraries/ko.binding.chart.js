define(['knockout', 'jquery', 'chartjs'], function(ko,$,Chart) {

	var charts = {};

	function getValue(key) {
		if (typeof key == 'function') {
			return key();
		} else {
			return key;
		}
	}

	ko.bindingHandlers.chartjs = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			// Data is not yet loaded in observables, and chart.js does nog seem to support updating data very well.
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var chartType = allBindingsAccessor.get('chartType') || "bar";
			var dataField = allBindingsAccessor.get('dataField') || "subTotaal";
			var labelField = allBindingsAccessor.get('labelField') || "naam";
			var colorField = allBindingsAccessor.get('colorField') || "kleur";
			var dataLabel = allBindingsAccessor.get('dataLabel') || "Data";

			var labels = ko.unwrap(valueAccessor()).map(function(element) {
				return getValue(element[labelField]);
			});
			var data = ko.unwrap(valueAccessor()).map(function(element) {
				return getValue(element[dataField]);
			});
			var colors = ko.unwrap(valueAccessor()).map(function(element) {
				return getValue(element[colorField]);
			});
		
			var ctx = $(element);

			if(charts[ctx.context.id]) {
				charts[ctx.context.id].destroy();
			}

			var dataSet = {
				label: dataLabel,
				data: data,
				borderWidth: 1
			};

			if(chartType === "line") {
				dataSet.fill = false;
				dataSet.lineTension = 0;
				dataSet.borderWidth = 5;
				dataSet.borderJoinStyle = 'miter';
			}

			if(colors[0]) {
				dataSet.backgroundColor = colors;
			}

			var chartData = {
				type: chartType,
				data: {
					labels: labels,
					datasets: [dataSet]
				},
				options: {
					responsive: false,
					scales: {
						yAxes: [{
								ticks: {
									beginAtZero:true
								}
						}]
					}
				}
			};

			charts[ctx.context.id] = new Chart(ctx, chartData);
		}
	};
});