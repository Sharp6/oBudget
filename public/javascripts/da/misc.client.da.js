define(['jquery'], function($){
	"use strict";

	var loadBanken = function() {
		return $.ajax({
			dataType: "json",
		  url: "/api/banken"
		}).promise();
	};

	var loadStatuses = function() {
		return $.ajax({
			dataType: "json",
			url: "/api/statuses"
		}).promise();
	};

	var loadCategorieen = function() {
		return $.ajax({
			dataType: "json",
			url: "/api/categorieen"
		}).promise();
	}

	return {
		loadBanken : loadBanken,
		loadStatuses : loadStatuses,
		loadCategorieen : loadCategorieen
	};
});