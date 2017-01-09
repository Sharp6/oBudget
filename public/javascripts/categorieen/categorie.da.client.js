define(['jquery'], function($){
	"use strict";
	
	var load = function() {
		return $.ajax({
			dataType: "json",
			url: "/api/categorieen"
		}).promise();
	};

	return {
		load : load
	};
});