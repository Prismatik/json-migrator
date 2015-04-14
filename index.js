var fs = require('fs');
var moment = require('moment');

//perform the migration on the provided doc (returning the modified document)
var migrate = function(doc, migrationPath) {

  //read and parse json migration document
  var migrationDoc = fs.readFileSync(migrationPath, 'utf-8');
  var migration = JSON.parse(migrationDoc);

  if (!migration) throw new Error("migration must be a valid json document");

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
  if (typeof chunk === "object") {

    //this is not a string and so requires conversion
    if (chunk.type) return convertType(chunk);

    var fieldContents = doc[chunk.field]

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

var convertType = function(chunk) {
  if (typeof chunk.type !== "string") throw new Error("type must be a string");
  var type = chunk.type.toLowerCase();
  
  if (type === "integer") return parseInt(chunk.value);
  if (type === "number") return parseFloat(chunk.value);
  if (type === "date") return moment(chunk.value, chunk.format);
  if (type === "boolean") return Boolean(chunk.value);
  if (type === "null") return null;
  //this shouldn't be necessary as type can be left blank for strings, but just in case
  if (type === "string") return chunk.value;
  throw new Error("invalid type " + chunk.type);
}

//return a function to delete a field from the specified doc
var del = function(doc) {
  return function(field) { delete doc[field]; }
}

module.exports = {
  generateValue: generateValue,
  migrate: migrate
}
