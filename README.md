TODO

General:
-------------------------------
 - Create a front end
  - make a knockout/bootstrap SPA for viewing verrichtingen, with the ability to filter on:
   - beginDate
   - endDate
   - bank
   - category
   - status
 - Specify the state machine for statuses
  - imported
  - duplicate / notDuplicate
  - classified

fileHandler: 
-------------------------------
 - Promisify csv reader.
 - Refactor
 - Add package.json for dependencies


Make workflow and module responsibilities explicit:
----------------------------------------------------

IMPORTING WORKFLOW

- filesCollector: gathers list of files and returns those that are not yet processed. Returns array of filenames to handle.
- fileHandler: handles a single input file and logs it processing.
- categorizer: takes all imported verrichtingen and checks for completeness/duplicates.
- classifier: takes all notDuplicate verrichtingen and tries to classify them, setting the "proposedClassification" field. This can be done either by business rules or automated classification.

TRAINING WORKFLOW

- trainer

Verrichtingen states
- imported (fileHandler)
- duplicate/notDuplicate (categorizer)
- categorized (user decision)
