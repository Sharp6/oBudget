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

	var saveVerrichtingToServer = function(id,data) {
		console.log(data);
		return $.ajax({
			//dataType: "json",
			url: "/api/verrichtingen/" + id,
			data: {verrichting: data},
			method: "PUT"
		}).promise();
	};
	
	return {
		save : saveVerrichtingToServer,
		load : loadVerrichtingServer,
		loadWithFilter : loadWithFilter
		//remove: removeIngredientServer
	};
});