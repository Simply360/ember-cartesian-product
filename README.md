# Ember-cartesian-product

This addon provides a computed property macro that calculates the [cartesian product](https://en.wikipedia.org/wiki/Cartesian_product) of N arrays.

## Installation

```
ember install ember-cartesian-product
```

_Note:_ This addon requires ember.js >= 2.0

## Usage

The `cartesian` macro works by accepting a key to another property on the object whose value is an array of N arrays. The computed property's value will be equal to an array of N-tuple arrays, consisting of every distinct combination of one element from each the source arrays. For example, say you have an object with two arrays called `animals` and `colors`, and you want to calculate the cartesian product of those arrays.

```
import Ember from 'ember';
import cartesian from 'ember-cartesian-product';

...

let MyObject = Ember.Object.extend({
  cartesianProduct: cartesian('myArrays')
});

let subject = MyObject.create({
  animals: ['cat', 'dog'],
  colors: ['orange', 'blue'],
  myArrays: Ember.computed.collect('animals', 'colors')
});

// Initial value
subject.get('cartesianProduct');
  /*
   * [
   *   ['cat', 'orange'], ['cat', 'blue'],
   *   ['dog', 'orange'], ['dog', 'blue']
   * ]
   */

// Swapping out one of the arrays
let newColors = Ember.A(['black', 'teal']);
subject.set('colors', newColors);
subject.get('cartesianProduct');
  /*
   * [
   *   ['cat', 'black'], ['cat', 'teal'],
   *   ['dog', 'black'], ['dog', 'teal']
   * ]
   */

// Adding an element to one of the arrays
newColors.pushObject('green');
subject.get('cartesianProduct');
  /*
   * [
   *   ['cat', 'black'], ['cat', 'teal'], ['cat', 'green'],
   *   ['dog', 'black'], ['dog', 'teal'], ['dog', 'green']
   * ]
   */
```

You can also dynamically change which arrays are being used to calculate the product:

```
let MyObject = Ember.Object.extend({
  cartesianProduct: cartesian('myArrays')
});

let animals = ['cat', 'dog'];
let colors = ['black', 'teal'];
let myArrays = Ember.A([animals, colors]);
let subject = MyObject.create({
  myArrays: myArrays
});

// Initial value
subject.get('cartesianProduct');
  /*
   * [
   *   ['cat', 'black'], ['cat', 'teal'],
   *   ['dog', 'black'], ['dog', 'teal']
   * ]
   */

// Add a third source array
myArrays.pushObject(['square', 'circle', 'triangle']);
subject.get('cartesianProduct');
  /*
   * [
   *   ['cat', 'black', 'square'], ['cat', 'black', 'circle'], ['cat', 'black', 'triangle']
   *   ['cat', 'teal', 'square'],  ['cat', 'teal', 'circle'],  ['cat', 'teal', 'triangle']
   *   ['dog', 'black', 'square'], ['dog', 'black', 'circle'], ['dog', 'black', 'triangle']
   *   ['dog', 'teal', 'square'],  ['dog', 'teal', 'circle'],  ['dog', 'teal', 'triangle']
   * ]
   */
```

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
