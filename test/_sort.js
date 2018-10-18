const Sort = require("../src/Quick3Sort");
const { expect } = require("chai");

describe("Sort", () => {
  it("should be a function", () => {
    expect(Sort).to.be.a("function");
  });
  it("should have a sort method", () => {
    expect(Sort.prototype.sort).to.be.a("function");
  });
  it("should return ordered result", () => {
    let inputSamples = Array(1000)
      .fill(0)
      .map((item, index) => {
        return index + 1;
      });
    let outputSamples = inputSamples.slice();

    // Suffle input samples.
    for (let i = inputSamples.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * i);
      [inputSamples[i], inputSamples[j]] = [inputSamples[j], inputSamples[i]];
    }

    const sort = new Sort(inputSamples);
    expect(sort.sort()).to.deep.eql(outputSamples);
  });
});
