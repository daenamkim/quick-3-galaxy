class Quick3Sort {
  constructor(array) {
    this.array = array;
  }

  sort() {
    function run(array) {
      if (array.length < 2) {
        return array;
      }

      let lessThanPivot = [];
      let equalToPivot = [];
      let greaterThanPivot = [];
      const pivot = array[0];
      for (let item of array) {
        if (item < pivot) {
          lessThanPivot.push(item);
        } else if (item === pivot) {
          equalToPivot.push(item);
        } else {
          greaterThanPivot.push(item);
        }
      }

      let result = [];
      result = result.concat(run(lessThanPivot));
      result = result.concat(equalToPivot);
      result = result.concat(run(greaterThanPivot));
      return result;
    }
    return run(this.array);
  }

  returnValue(value) {
    return value;
  }
}

module.exports = Quick3Sort;
