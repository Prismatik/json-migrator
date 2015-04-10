var assert = require('assert');
var migrator = require('../index.js');

describe('migrator', function() {
  describe('new', function() {
    it("must successfully add the new field", function() {
      var doc = {
        firstName: "Simon"
      }
      var transform = {
        type: "new",
        target: "lastName",
        value: "Taylor"
      }
      var updatedDoc = migrator(doc, transform);
      assert.deepEqual(updatedDoc, { firstName: "Simon", lastName: "Taylor" });
    });
  });
  describe('delete', function() {
    it("must successfully delete the field", function() {
      var doc = {
        firstName: "Simon",
        lastName: "Taylor"
      }
      var transform = {
        type: "delete",
        target: "lastName"
      }
      var updatedDoc = migrator(doc, transform);
      assert.deepEqual(updatedDoc, { firstName: "Simon" });
    });
  });
  describe('move', function() {
    it("must successfully delete the field", function() {
      var doc = {
        firstName: "Simon",
      }
      var transform = {
        type: "move",
        target: "firstName",
        destination: "myName"
      }
      var updatedDoc = migrator(doc, transform);
      assert.deepEqual(updatedDoc, { myName: "Simon" });
    });
  });
});
