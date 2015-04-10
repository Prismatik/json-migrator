var migrator = function(doc, migration) {
  var type = migration.type;
  if (type === "new") {
    doc[migration.target] = migration.value;
  }

  if (type === "delete") {
    delete doc[migration.target];
  }

  if (type === "move") {
    doc[migration.destination] = doc[migration.target];
    delete doc[migration.target];
  }

  return doc;
}

module.exports = migrator;
