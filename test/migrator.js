var assert = require('assert');
var fs = require('fs');
var migrate = require('../index.js').migrate;

describe('migrate', function() {
  describe('adding a new field', function() {
    it("must successfully add the new field", function() {
      var doc = {
        firstName: "Simon"
      }
      var migrationPath = './test/migrations/add-lastname.json';
      var updatedDoc = migrate(doc, migrationPath);
      assert.deepEqual(updatedDoc, { firstName: "Simon", lastName: "Taylor" });
    });
  });

  describe('deleting a field', function() {
    it("must successfully delete the field", function() {
      var doc = {
        firstName: "Simon",
        lastName: "Taylor"
      }
      var migrationPath = './test/migrations/delete-lastname.json';
      var updatedDoc = migrate(doc, migrationPath);
      assert.deepEqual(updatedDoc, { firstName: "Simon" });
    });
    it("must successfully delete multiple fields", function() {
      var doc = {
        firstName: "Simon",
        lastName: "Taylor",
        dob: new Date(1984, 6, 27)
      }
      var migrationPath = './test/migrations/delete-names.json';
      var updatedDoc = migrate(doc, migrationPath);
      assert.deepEqual(updatedDoc, { dob: new Date(1984, 6, 27) });
    });
  });

  describe('copying a field', function() {
    it("must successfully copy the field", function() {
      var doc = {
        firstName: "Simon",
      }
      var migrationPath = './test/migrations/copy-firstname.json';
      var updatedDoc = migrate(doc, migrationPath);
      assert.deepEqual(updatedDoc, { firstName: "Simon", myName: "Simon" });
    });
  });

  describe('moving a field', function() {
    it("must successfully move a field", function() {
      var doc = {
        firstName: "Simon",
      }
      var migrationPath = './test/migrations/move-firstname.json';
      var updatedDoc = migrate(doc, migrationPath);
      assert.deepEqual(updatedDoc, { myName: "Simon" });
    });
    it("must concatenate multiple values", function () {
      var doc = {
        firstName: "Simon",
        lastName: "Taylor"
      }
      var migrationPath = './test/migrations/name-concatenate.json';
      var updatedDoc = migrate(doc, migrationPath);
      assert.deepEqual(updatedDoc, {fullName: "Mr Simon Taylor"});
    });
  });

  describe('using regular expressions', function() {
    it("must default to first result when no position specified", function () {
      var doc = {
        fullName: "Mr Simon Taylor"
      }
      var migrationPath = './test/migrations/regex-no-position.json';
      var updatedDoc = migrate(doc, migrationPath);
      assert.deepEqual(updatedDoc, {title: "Mr"});
    });
    it("must return the result based on the position specified", function () {
      var doc = {
        fullName: "Mr Simon Taylor"
      }
      //var firstName = {field: "fullName", pattern: {regex: /\S*/g, position: 2}}
      //var transform = {
        //value: firstName,
        //target: "firstName",
        //delete: "fullName"
      //}
      var migrationPath = './test/migrations/regex-with-position.json';
      var updatedDoc = migrate(doc, migrationPath);
      assert.deepEqual(updatedDoc, {firstName: "Simon"});
    });
  });
});
