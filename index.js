var migrator = function(doc, migration) {
  if (migration.target && migration.value) {
    doc[migration.target] = generateValue(doc, migration.value);
  }

  if (migration.delete) {
    delete doc[migration.delete];
  }

  return doc;
}

var generateValue = function(doc, format) {
  //if format is an array, map through the array to generate the value
  if (format instanceof Array) {
    return format.map(function(chunk) {
      if (typeof chunk === "object") return doc[chunk.field];
      return chunk;
    }).join('');
  //if format is not an array, just generate the value
  } else {
    if (typeof format === "object") return doc[format.field];
    return format;
  }
}

module.exports = {
  generateValue: generateValue,
  migrator: migrator
}
