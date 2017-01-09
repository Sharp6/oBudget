var cheerio = require("cheerio");

function scrape(fileToParse) {
	return new Promise(function(resolve,reject) {
		var parsedData = [];
		var $ = cheerio.load(fileToParse.rawData);
		$(".orc-timeline-item").each(function(i, elem) {
			parsedData.push({
				title: $(this).find(".orc-timeline-item__summary-title").text(),
				subtitle: $(this).find(".orc-timeline-item__summary-subtitle").text(),
				datum: $(this).find(".orc-timeline-item__prefix-date").text(),
				bedrag: $(this).find(".orc-timeline-item__info-col--amount span span.ng-binding").text()
			});
		});

		fileToParse.parsedData = parsedData;
		resolve(fileToParse);
	});
}

module.exports = scrape;


