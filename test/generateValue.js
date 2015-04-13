var assert = require('assert');
var generateValue = require('../index.js').generateValue;

describe("generateValue", function() {
  it("must return a single primitive", function() {
    var value = generateValue({}, "awesomesauce!");
    assert.equal(value, "awesomesauce!");
    var value2 = generateValue({}, 1337);
    assert.equal(value2, 1337);
  });
  it("must return a single field from the document ", function() {
    var doc = { firstName: "Darth", lastName: "Vader" }
    var value = generateValue(doc, {field: "lastName"});
    assert.equal(value, "Vader");
  });
  it("must return a string when given an array of strings and fields", function() {
    var doc = {food: "Blue Milk", place: "Tatooine"}
    var format = ["Luke loves to drink ", {field: "food"}, " on ", {field: "place"}]
    var value = generateValue(doc, format);
    assert.equal("Luke loves to drink Blue Milk on Tatooine", value);
  });
});
