#Document Migrator

###Using the migrator

The migrator takes in two inputs

* doc - the document to be modified by the migration
* migrationPath - the file location of the migration (a JSON file)

###Migration format

The migration is an object with the following properties

* target - which field on the document should updated by the migration
* value - what should the 'target' field be updated with (can include references to other fields in the same document)
* delete - delete this field (or fields) from the document (occurs AFTER the target field has been updated)

###Example

Your Migration (JSON Document)

```
{
  "target": "fullName",
  "value": ["Mr ",{"field": "firstName"}," ",{"field": "lastName"}],
  "delete": ["firstName", "lastName"]
}
```

The Code

```
//not yet published on NPM, assuming 'document-migrator' is the module name
var migrate = require('document-migrator').migrate;

var doc = {
  firstName: "Simon",
  lastName: "Taylor"
}

//the location of the file containing your migration JSON document (as above)
var migrationPath = './migrations/generate-fullname.json';

var result = migrate(doc, migrationPath);

//result === {fullName: "Mr Simon Taylor"}
```

### Features to add

* support for referencing nested properties using "."
* support for multiple consecutive updates by passing an array
* add support for other patterns i.e. split, maybe substring?? 
* add safe fail for patterns (what if position does not exist)
