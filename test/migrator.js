var assert = require('assert');
var migrate = require('../index.js').migrate;

describe('migrate', function() {
  describe('adding a new field', function() {
    it("must successfully add the new field", function() {
      var doc = {
        firstName: "Simon"
      }
      var transform = {
        target: "lastName",
        value: "Taylor"
      }
      var updatedDoc = migrate(doc, transform);
      assert.deepEqual(updatedDoc, { firstName: "Simon", lastName: "Taylor" });
    });
  });

  describe('deleting a field', function() {
    it("must successfully delete the field", function() {
      var doc = {
        firstName: "Simon",
        lastName: "Taylor"
      }
      var transform = {
        delete: "lastName"
      }
      var updatedDoc = migrate(doc, transform);
      assert.deepEqual(updatedDoc, { firstName: "Simon" });
    });
    it("must successfully delete multiple fields", function() {
      var doc = {
        firstName: "Simon",
        lastName: "Taylor",
        dob: new Date(1984, 6, 27)
      }
      var transform = {
        delete: ["firstName", "lastName"]
      }
      var updatedDoc = migrate(doc, transform);
      assert.deepEqual(updatedDoc, { dob: new Date(1984, 6, 27) });
    });
  });

  describe('copying a field', function() {
    it("must successfully copy the field", function() {
      var doc = {
        firstName: "Simon",
      }
      var transform = {
        target: "myName",
        value: {field: "firstName"}
      }
      var updatedDoc = migrate(doc, transform);
      assert.deepEqual(updatedDoc, { firstName: "Simon", myName: "Simon" });
    });
  });

  describe('moving a field', function() {
    it("must successfully move a field", function() {
      var doc = {
        firstName: "Simon",
      }
      var transform = {
        target: "myName",
        value: {field: "firstName"},
        delete: "firstName"
      }
      var updatedDoc = migrate(doc, transform);
      assert.deepEqual(updatedDoc, { myName: "Simon" });
    });
  });
});
