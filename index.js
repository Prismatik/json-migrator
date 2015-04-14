var fs = require('fs');
var moment = require('moment');

//perform the migration on the provided doc (returning the modified document)
var migrate = function(doc, migrationPath) {

  //read and parse json migration document
  var migrationDoc = fs.readFileSync(migrationPath, 'utf-8');
  var migration = JSON.parse(migrationDoc);

  if (!migration) throw new Error("migration must be a valid json document");

  //perform document update (migration)
  if (migration.target && migration.hasOwnProperty("value")) {
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

var parseDoc = function(doc) {
  try {
    return JSON.parse(doc);
  } catch (e) {
    return false;
  }
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
  if (chunk === null) return null;
  if (typeof chunk === "object") {

    //this is not a string and so requires conversion
    if (chunk.date && chunk.format) return convertDate(chunk);

    //this is a pattern match so use regex
    if (chunk.pattern) return applyRegex(chunk.pattern, doc[chunk.field]);

    //this is just a string so return the value
    return doc[chunk.field];
  }
  return chunk;
}

var applyRegex = function(pattern, fieldContents) {
  //regex must be in string format! no /.../ and backslash double escaped
  var regex = new RegExp(pattern.regex, "g");
  var match = fieldContents.match(regex);
  //return the piece of the regex as specified (defaults to 0)
  var position = parseInt(pattern.position) || 0;
  return match[position];
}

var convertDate = function(chunk) {
  return moment(chunk.date, chunk.format);
}

//return a function to delete a field from the specified doc
var del = function(doc) {
  return function(field) { delete doc[field]; }
}

module.exports = {
  generateValue: generateValue,
  migrate: migrate
}
