class Quick3Sort {
  constructor(array) {
    this.array = array;
  }

  sort() {
    function run(array) {
      if (array.length < 1) {
        return array;
      }
      let lessThanPivot = [];
      let greaterThanPivot = [];
      const pivot = array[0];
      for (let item of array) {
        if (item < pivot) {
          lessThanPivot.push(item);
        } else if (item > pivot) {
          greaterThanPivot.push(item);
        }
      }

      let result = [];
      result = result.concat(run(lessThanPivot));
      result = result.concat(pivot);
      result = result.concat(run(greaterThanPivot));
      return result;
    }
    let test = run(this.array);
    return test;
  }

  returnValue(value) {
    return value;
  }
}

module.exports = Quick3Sort;
