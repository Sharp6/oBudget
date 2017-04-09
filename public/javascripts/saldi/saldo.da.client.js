define(['jquery'], function($){
	"use strict";
	
	var load = function() {
		return $.ajax({
			dataType: "json",
			url: "/api/saldi"
		}).promise();
	};

	var verify = function(saldo) {
		return $.ajax({
			dataType: "json",
			url: "/api/saldoChecker/" + saldo.saldoId
		}).promise();
	}

	return {
		load : load,
		verify: verify
	};
});