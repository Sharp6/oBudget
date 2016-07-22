fileToParse.dataArray.forEach(function(data) {
				data.info = " - " + data.rekeningTegenpartij + " - " + data.naamTegenpartij + " - " + data.mededeling;
			});
			// Headers already provide good data fields