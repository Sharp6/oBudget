"use strict";

define(['knockout', 'moment'], function(ko,moment) {
	var YearsVM = function(params) {
		this.selectedYear = params.value;

    this.minDatum = ko.observable(moment());
    this.maxDatum = ko.observable(moment());
		this.minYear = ko.computed(function() {
			return this.minDatum().format("YYYY");
		}.bind(this));
		this.maxYear = ko.computed(function() {
			return this.maxDatum().format("YYYY");
		}.bind(this));
		this.availableYears = ko.computed(function() {
			var years = [];
			var currYear = this.minYear();
			do {
				years.push(currYear.toString());
			} while(currYear++ < this.maxYear());

			return years;
		}.bind(this));

    this.loadTimeExtremes = function() {
      $.getJSON("/api/actions/getTimeExtremes", function(result) {
        this.minDatum(moment(result[0].minDate));
				this.maxDatum(moment(result[1].maxDate));
      }.bind(this));
    }

		this.init = function() {
      this.loadTimeExtremes();
		}.bind(this);

		this.init();
	};

	return YearsVM;
});
