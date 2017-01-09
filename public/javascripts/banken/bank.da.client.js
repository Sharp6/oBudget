define(['jquery'], function($){
	"use strict";
	
	var load = function() {
		return $.ajax({
			dataType: "json",
			url: "/api/banken"
		}).promise();
	};

	return {
		load : load
	};
});