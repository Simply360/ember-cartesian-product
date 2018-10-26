import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { isArray, A } from '@ember/array';

export default function cartesian(sourceArraysKey) {
  assert(`The first argument passed to "cartesian" must be a string.`, typeof sourceArraysKey === 'string');
  let dependentKey = `${sourceArraysKey}.@each.[]`;

  return computed(dependentKey, {
    get() {
      let sourceArrays = this.get(sourceArraysKey);
      assert(`"cartesian" requires that the value of the target property "${sourceArraysKey}" be an array.`, isArray(sourceArrays));
      let arrays = A(sourceArrays);

      let results = [];
      arrays.forEach((thisSourceArray, sourceArrayIndex) => {
        assert(`"cartesian" requires that each element in the target array "${sourceArraysKey}" be an array.`,
          isArray(thisSourceArray));
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
