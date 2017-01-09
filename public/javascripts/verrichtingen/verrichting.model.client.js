define(['knockout', 'moment'], function(ko, moment) {
	var verrichtingModel = function(data) {
		var self = this;

		//var parsedDate = moment.utc(data.datum);
		//parsedDate.local();
		
		self.bedrag = data.bedrag;
		self.datum = moment(data.datum); //ko.observable(parsedDate.format("DD/MM/YYYY"));
		self.datumDisplay = data.datumDisplay;
		self.maand3letters = self.datum.format('MMM');
		self.dag = self.datum.format('D');

		self.bank = data.bank;
		self.info = data.info;
		self.categorie = data.categorie;
		self.periodiciteit = data.periodiciteit;
		self.manualLabel = data.manualLabel;

		self.categorieIcon = "/images/categorieen/" + self.categorie + ".svg";
		

		//console.log("datum", self.datum.format("MM DD"), "displayDatum", self.datumDisplay);
	};
	
	return verrichtingModel;
});