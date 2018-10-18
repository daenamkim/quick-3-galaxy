class Quick3Sort {
  constructor(array) {
    this.array = array;
    this.steps = [];
  }

  sort() {
    let buffer = this.array.slice();
    this.steps.push(this.array.slice());
    // Lexical scope.
    const run = (array, offset = 0) => {
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
      if (lessThanPivot.length > 0) {
        buffer.splice(offset, lessThanPivot.length, ...lessThanPivot);
        if (equalToPivot.length > 0) {
          buffer.splice(
            offset + lessThanPivot.length,
            equalToPivot.length,
            ...equalToPivot
          );
          if (greaterThanPivot.length > 0) {
            buffer.splice(
              offset + lessThanPivot.length + equalToPivot.length,
              greaterThanPivot.length,
              ...greaterThanPivot
            );
          }
        }
      }
      this.steps.push(buffer.slice());
      result = result.concat(run(lessThanPivot, offset));
      result = result.concat(equalToPivot);
      result = result.concat(
        run(
          greaterThanPivot,
          offset + lessThanPivot.length + equalToPivot.length
        )
      );
      return result;
    };

    return run(this.array);
  }

  getSteps() {
    return this.steps;
  }
}

module.exports = Quick3Sort;
