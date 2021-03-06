import { A } from '@ember/array';
import EmberObject from '@ember/object';
import { collect } from '@ember/object/computed';
import { run } from '@ember/runloop';
import cartesian from 'ember-cartesian-product';
import { module, test } from 'qunit';

let myObj;

module('Unit | Macro | cartesian', {
});

test('Correct when target property is a regular array with one key containing an Ember.Array', function(assert) {
  assert.expect(5);

  let MyType = EmberObject.extend({
    val: cartesian('arrays')
  });

  let animals = A();
  myObj = MyType.create({
    arrays: [animals]
  });

  assert.deepEqual(myObj.get('val'), []);

  run(() => {
    animals.setObjects(['cat', 'dog', 'bird', 'mouse']);
  });

  assert.deepEqual(myObj.get('val'), [['cat'], ['dog'], ['bird'], ['mouse']]);

  run(() => {
    animals.pushObject('fish');
  });

  assert.deepEqual(myObj.get('val'), [['cat'], ['dog'], ['bird'], ['mouse'], ['fish']]);

  run(() => {
    animals.setObjects(['giraffe', 'ostrich']);
  });

  assert.deepEqual(myObj.get('val'), [['giraffe'], ['ostrich']]);

  run(() => {
    myObj.set('arrays', [['zebra']]);
  });

  assert.deepEqual(myObj.get('val'), [['zebra']]);
});

test('Correct when target property is a regular array with two keys containing plain arrays', function(assert) {
  assert.expect(2);

  let MyType = EmberObject.extend({
    val: cartesian('arrays')
  });

  let animals = ['cat', 'dog'];
  let cars = ['chevy', 'honda'];
  myObj = MyType.create({
    arrays: [animals, cars]
  });

  assert.deepEqual(myObj.get('val'), [
    ['cat', 'chevy'], ['cat', 'honda'],
    ['dog', 'chevy'], ['dog', 'honda']
  ]);

  run(() => {
    myObj.set('arrays', [cars, animals]);
  });

  assert.deepEqual(myObj.get('val'), [
    ['chevy', 'cat'], ['chevy', 'dog'],
    ['honda', 'cat'], ['honda', 'dog']
  ]);
});

test('Correct when target property is an Ember.Array with one key', function(assert) {
  assert.expect(5);

  let MyType = EmberObject.extend({
    val: cartesian('arrays'),
    arrays: collect('animals')
  });

  let animals = A();
  myObj = MyType.create({
    animals
  });

  assert.deepEqual(myObj.get('val'), []);

  run(() => {
    animals.setObjects(['cat', 'dog', 'bird', 'mouse']);
  });

  assert.deepEqual(myObj.get('val'), [['cat'], ['dog'], ['bird'], ['mouse']]);

  run(() => {
    animals.pushObject('fish');
  });

  assert.deepEqual(myObj.get('val'), [['cat'], ['dog'], ['bird'], ['mouse'], ['fish']]);

  run(() => {
    animals.setObjects(['giraffe', 'ostrich']);
  });

  assert.deepEqual(myObj.get('val'), [['giraffe'], ['ostrich']]);

  run(() => {
    myObj.set('animals', ['zebra']);
  });

  assert.deepEqual(myObj.get('val'), [['zebra']]);
});

test('Correct when target property is an Ember.Array with two elements', function(assert) {
  assert.expect(8);

  let MyType = EmberObject.extend({
    val: cartesian('arrays'),
    arrays: collect('animals', 'cars')
  });

  myObj = MyType.create({
    animals: [],
    cars: []
  });

  assert.deepEqual(myObj.get('val'), [], 'Correct initially');

  let animals = A(['cat', 'dog', 'bird']);
  run(() => {
    myObj.set('animals', animals);
  });

  assert.deepEqual(myObj.get('val'), [], 'Correct after setting animals to a populated array');

  let cars = A(['toyota', 'ford']);
  run(() => {
    myObj.set('cars', cars);
  });

  assert.deepEqual(myObj.get('val'), [
    ['cat', 'toyota'], ['cat', 'ford'],
    ['dog', 'toyota'], ['dog', 'ford'],
    ['bird', 'toyota'], ['bird', 'ford']
  ], 'Correct after setting cars to a populated array');

  run(() => {
    animals.pushObject('fish');
  });

  assert.deepEqual(myObj.get('val'), [
    ['cat', 'toyota'], ['cat', 'ford'],
    ['dog', 'toyota'], ['dog', 'ford'],
    ['bird', 'toyota'], ['bird', 'ford'],
    ['fish', 'toyota'], ['fish', 'ford']
  ]);

  run(() => {
    cars.pushObject('volvo');
  });

  assert.deepEqual(myObj.get('val'), [
    ['cat', 'toyota'], ['cat', 'ford'], ['cat', 'volvo'],
    ['dog', 'toyota'], ['dog', 'ford'], ['dog', 'volvo'],
    ['bird', 'toyota'], ['bird', 'ford'], ['bird', 'volvo'],
    ['fish', 'toyota'], ['fish', 'ford'], ['fish', 'volvo']
  ]);

  run(() => {
    myObj.set('animals', ['giraffe', 'ostrich']);
  });

  assert.deepEqual(myObj.get('val'), [
    ['giraffe', 'toyota'], ['giraffe', 'ford'], ['giraffe', 'volvo'],
    ['ostrich', 'toyota'], ['ostrich', 'ford'], ['ostrich', 'volvo']
  ]);

  run(() => {
    myObj.set('cars', ['chevy']);
  });

  assert.deepEqual(myObj.get('val'), [
    ['giraffe', 'chevy'],
    ['ostrich', 'chevy']
  ]);

  run(() => {
    myObj.set('animals', []);
  });

  assert.deepEqual(myObj.get('val'), []);
});

test('Correct when target object is an Ember.Array with three elements', function(assert) {
  assert.expect(6);

  let MyType = EmberObject.extend({
    val: cartesian('arrays'),
    arrays: collect('animals', 'cars', 'cities')
  });

  myObj = MyType.create({
    animals: [],
    cars: [],
    cities: []
  });

  assert.deepEqual(myObj.get('val'), [], 'Correct initially');

  let animals = A(['cat', 'dog', 'bird']);
  run(() => {
    myObj.set('animals', animals);
  });

  assert.deepEqual(myObj.get('val'), [], 'Correct after setting animals to a populated array');

  let cars = A(['toyota', 'ford']);
  run(() => {
    myObj.set('cars', cars);
  });

  assert.deepEqual(myObj.get('val'), [], 'Correct after setting cars to a populated array');

  let cities = A(['Houston']);
  run(() => {
    myObj.set('cities', cities);
  });

  assert.deepEqual(myObj.get('val'), [
    ['cat', 'toyota', 'Houston'], ['cat', 'ford', 'Houston'],
    ['dog', 'toyota', 'Houston'], ['dog', 'ford', 'Houston'],
    ['bird', 'toyota', 'Houston'], ['bird', 'ford', 'Houston']
  ], 'Correct after setting cities to a populated array');

  run(() => {
    myObj.set('animals', ['giraffe', 'ostrich']);
  });

  assert.deepEqual(myObj.get('val'), [
    ['giraffe', 'toyota', 'Houston'], ['giraffe', 'ford', 'Houston'],
    ['ostrich', 'toyota', 'Houston'], ['ostrich', 'ford', 'Houston']
  ], 'Correct after setting cities to a populated array');

  run(() => {
    myObj.set('cities', ['New York', 'London']);
  });

  assert.deepEqual(myObj.get('val'), [
    ['giraffe', 'toyota', 'New York'], ['giraffe', 'toyota', 'London'], ['giraffe', 'ford', 'New York'], ['giraffe', 'ford', 'London'],
    ['ostrich', 'toyota', 'New York'], ['ostrich', 'toyota', 'London'], ['ostrich', 'ford', 'New York'], ['ostrich', 'ford', 'London']
  ], 'Correct after setting cities to a populated array');
});

test('Correct when target object changes from one Ember.Array to another', function(assert) {
  assert.expect(6);

  let animals = A(['cat', 'dog', 'bird']);
  let cars = A(['toyota', 'ford']);
  let cities = A(['Houston']);
  let MyType = EmberObject.extend({
    val: cartesian('arrays')
  });

  myObj = MyType.create({
    arrays: A([])
  });

  assert.deepEqual(myObj.get('val'), [], 'Correct initially');

  let newArrays = A([animals]);
  run(() => {
    myObj.set('arrays', newArrays);
  });

  assert.deepEqual(myObj.get('val'), [['cat'], ['dog'], ['bird']], 'Correct after setting the source array to contain the animals array');

  run(() => {
    newArrays.pushObjects([cars, cities]);
  });

  assert.deepEqual(myObj.get('val'), [
    ['cat', 'toyota', 'Houston'], ['cat', 'ford', 'Houston'],
    ['dog', 'toyota', 'Houston'], ['dog', 'ford', 'Houston'],
    ['bird', 'toyota', 'Houston'], ['bird', 'ford', 'Houston']
  ], 'Correct after adding the cars and cities arrays to the source array');

  run(() => {
    animals.setObjects(['giraffe', 'ostrich']);
  });

  assert.deepEqual(myObj.get('val'), [
    ['giraffe', 'toyota', 'Houston'], ['giraffe', 'ford', 'Houston'],
    ['ostrich', 'toyota', 'Houston'], ['ostrich', 'ford', 'Houston']
  ], 'Correct after changing the content of the animals array');

  run(() => {
    cities.setObjects(['New York', 'London']);
  });

  assert.deepEqual(myObj.get('val'), [
    ['giraffe', 'toyota', 'New York'], ['giraffe', 'toyota', 'London'], ['giraffe', 'ford', 'New York'], ['giraffe', 'ford', 'London'],
    ['ostrich', 'toyota', 'New York'], ['ostrich', 'toyota', 'London'], ['ostrich', 'ford', 'New York'], ['ostrich', 'ford', 'London']
  ], 'Correct after changing the content of the cities array');

  run(() => {
    newArrays.replace(1, 1, [['tesla']]);
  });

  assert.deepEqual(myObj.get('val'), [
    ['giraffe', 'tesla', 'New York'], ['giraffe', 'tesla', 'London'],
    ['ostrich', 'tesla', 'New York'], ['ostrich', 'tesla', 'London']
  ], 'Correct after replacing the cars array');
});

function testFailureDueToBadTargetPropertyKey(description, val) {
  test(description, function(assert) {
    assert.expect(1);

    run(() => {
      assert.throws(() => {
        EmberObject.extend({
          val: cartesian(val)
        });
      }, new Error('Assertion Failed: The first argument passed to "cartesian" must be a string.'));
    });
  });
}

testFailureDueToBadTargetPropertyKey('Assertion fails when first argument is undefined', undefined);
testFailureDueToBadTargetPropertyKey('Assertion fails when first argument is 0', 0);
testFailureDueToBadTargetPropertyKey('Assertion fails when first argument is a positive integer', 4);
testFailureDueToBadTargetPropertyKey('Assertion fails when first argument is an array', []);

function testFailureDueToBadTargetProperty(description, val) {
  test(description, function(assert) {
    assert.expect(1);

    let MyType = EmberObject.extend({
      val: cartesian('arrays'),
      arrays: val
    });
    myObj = MyType.create();

    run(() => {
      assert.throws(() => {
        myObj.get('val');
      }, new Error('Assertion Failed: "cartesian" requires that the value of the target property "arrays" be an array.'));
    });
  });
}

testFailureDueToBadTargetProperty('Assertion fails when target property is undefined', undefined);
testFailureDueToBadTargetProperty('Assertion fails when target property is 0', 0);
testFailureDueToBadTargetProperty('Assertion fails when target property is a positive integer', 4);
testFailureDueToBadTargetProperty('Assertion fails when target property is an empty string', '');
testFailureDueToBadTargetProperty('Assertion fails when target property is a non-empty string', 'asdf');

function testFailureDueToBadElement(description, val) {
  test('Assertion fails when an element in the target array is a number', function(assert) {
    assert.expect(1);

    let MyType = EmberObject.extend({
      val: cartesian('arrays')
    });

    myObj = MyType.create({
      arrays: [['bird', 'cat'], val]
    });

    run(() => {
      assert.throws(() => {
        myObj.get('val');
      }, new Error('Assertion Failed: "cartesian" requires that each element in the target array "arrays" be an array.'));
    });
  });
}

testFailureDueToBadElement('Assertion fails when an element in the target array is undefined', undefined);
testFailureDueToBadElement('Assertion fails when an element in the target array is 0', 0);
testFailureDueToBadElement('Assertion fails when an element in the target array is a positive integer', 4);
testFailureDueToBadElement('Assertion fails when an element in the target array is an empty string', '');
testFailureDueToBadElement('Assertion fails when an element in the target array is a non-empty string', 'asdf');
