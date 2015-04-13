//perform the migration on the provided doc (returning the modified document)
var migrate = function(doc, migration) {
  //perform document update (migration)
  if (migration.target && migration.value) {
    doc[migration.target] = generateValue(doc, migration.value);
  }
  //delete fields if specified
  if (migration.delete) {
    if (migration.delete instanceof Array) {
      migration.delete.forEach(del(doc));
    } else {
      del(doc)(migration.delete);
    }
  }
  return doc;
}

//generate the value needed based on the format provided
var generateValue = function(doc, format) {
  //if format is an array, map through the array to generate the value
  if (format instanceof Array) {
    return format.map(function(chunk) {
      return getValue(doc, chunk);
    }).join('');
  //if format is not an array, just generate the value
  } else {
    return getValue(doc, format);
  }
}

//get the value from doc if a field value is requested, else return the value itself
var getValue = function(doc, chunk) {
  if (typeof chunk === "object") {
    var fieldContents = doc[chunk.field]
    //if this is not a pattern match, return field contents
    if (!chunk.pattern) return fieldContents;

    //this is a pattern match so use regex
    var regex = chunk.pattern.regex;
    var match = fieldContents.match(regex);
    //return the piece of the regex as specified (defaults to 0)
    var position = chunk.pattern.position || 0;
    return match[position];
  }
  return chunk;
}

//return a function to delete a field from the specified doc
var del = function(doc) {
  return function(field) { delete doc[field]; }
}

module.exports = {
  generateValue: generateValue,
  migrate: migrate
}
