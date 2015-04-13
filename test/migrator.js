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
    it("must concatenate multiple values", function () {
      var doc = {
        firstName: "Simon",
        lastName: "Taylor"
      }
      var transform = {
        target: "fullName",
        value: ["Mr ",{field: "firstName"}," ",{field: "lastName"}],
        delete: ["firstName", "lastName"]
      }
      var updatedDoc = migrate(doc, transform);
      assert.deepEqual(updatedDoc, {fullName: "Mr Simon Taylor"});
    });
  });

  describe('using regular expressions', function() {
    it("must default to first result when no position specified", function () {
      var doc = {
        fullName: "Mr Simon Taylor"
      }
      var transform = {
        target: "title",
        value: {field: "fullName", pattern: {regex: /\S*/g}},
        delete: "fullName"
      }
      var updatedDoc = migrate(doc, transform);
      assert.deepEqual(updatedDoc, {title: "Mr"});
    });
    it("must return the result based on the position specified", function () {
      var doc = {
        fullName: "Mr Simon Taylor"
      }
      var transform = {
        value: {field: "fullName", pattern: {regex: /\S*/g, position: 2}},
        target: "firstName",
        delete: "fullName"
      }
      var updatedDoc = migrate(doc, transform);
      assert.deepEqual(updatedDoc, {firstName: "Simon"});
    });
  });
});
