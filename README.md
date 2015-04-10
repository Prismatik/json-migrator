#Document Migrator

###Using the migrator

The migrator takes in two inputs

* doc - the document to be modified by the migration
* migration - the migration to transform the document

###Migration format

The migration is an object with the following properties

* target - which field on the document should updated by the migration
* value - what should the 'target' field be updated with
* delete - delete this field from the document (occurs after the target is updated)

###Example

```
var migrator = require('document-migrator');

var doc = {
  firstName: "Simon",
  lastName: "Taylor",
}
var transform = {
  target: "fullName",
  value: ["Mr ",{field: firstName}," ",{field: lastName}],
  delete: [firstName, lastName]
}
var result = migrator.migtrator(doc, transform);

//result === {fullName: "Mr Simon Taylor"}
```

### Features to add

* support for referencing nested properties using "."
* support for multiple consecutive updates by passing an array
* add regex support (as per Dave)
* add json schema validation before and after
