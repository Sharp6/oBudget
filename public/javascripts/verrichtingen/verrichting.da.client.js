define(['jquery'], function($){
	"use strict";
	
	var loadVerrichtingServer = function() {
		// FIX THIS to work without JQuery... 
		return $.getJSON("/api/verrichtingen").promise();
	};

	var loadWithFilter = function(query) {
		return $.ajax({
			dataType: "json",
			url: "/api/verrichtingen",
			data: query
		}).promise();
	};

	return {
		load : loadVerrichtingServer,
		loadWithFilter : loadWithFilter
	};
});