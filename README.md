# IWC - Intergalactic Workflow Commission

This group exists to create a registry of community workflows. 

Reproducibily is important. Our goals are to:
 - foster workflow use
 - incorporate versioning
 - capture more metadata: (names, versions, authors, use cases, etc.)
 - help scientists find workflows!

** Methods Proposal **
 - discover workflows
 - establish quality standards (version numbers, tools exist, author is set, training available, test exists ...)
 - automated testing of workflows
 - two layers of test data:
   - basic functionality testing (quick to run, tools exist) 
   - downsampled data (validity of workflow results)

Import process:
 - submit a pull request (PR) that adds a link to a GA file and metadata  
 - confirm that the GA and metadata conform to standards (linting criteria to be defined)
 - test the worklflow 
 - if linting passes, tests pass, and human review passes  PR is merged and added to registry list

