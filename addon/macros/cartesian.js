import Ember from 'ember';

const { computed } = Ember;

export default function cartesian (arrayKey) {
  let dependentKey = `${arrayKey}.@each.[]`;

  return computed(dependentKey, {
    get() {
      let arrays = Ember.A(this.get(arrayKey) || []);

      let results = [];
      arrays.forEach((thisSourceArray, sourceArrayIndex) => {
        let thisResultArray;
        if (sourceArrayIndex > 0) {
          let previousResultArrayLength = results.length;
          let thisSourceArrayLength = thisSourceArray.length;
          thisResultArray = new Array(thisSourceArrayLength * previousResultArrayLength);
          let thisResultIndex = 0;
          for (let previousResultIndex = 0; previousResultIndex < previousResultArrayLength; previousResultIndex++) {
            let previousResultArrayElement = results[previousResultIndex];
            for (let thisSourceArrayIndex = 0; thisSourceArrayIndex < thisSourceArrayLength; thisSourceArrayIndex++) {
              let thisSourceArrayElement = thisSourceArray[thisSourceArrayIndex];
              thisResultArray[thisResultIndex] = previousResultArrayElement.concat(thisSourceArrayElement);
              thisResultIndex++;
            }
          }
        } else {
          thisResultArray = thisSourceArray.map((x) => [x]);
        }
        results = thisResultArray;
      });
      return results;
    }
  });
}
