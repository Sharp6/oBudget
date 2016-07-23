var fs = require('fs');

fs.readFile("../testDataFiles/argenta.csv.solution.json", function(err, data) {
	if (err) {
		console.log(err);
	} else {
		var solution = JSON.parse(data.toString());
	}
});