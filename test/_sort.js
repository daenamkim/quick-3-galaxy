const Sort = require("../src/Quick3Sort");
const { expect } = require("chai");

describe("Sort", () => {
  it("should be a function", () => {
    expect(Sort).to.be.a("function");
  });
  it("should have a sort method", () => {
    expect(Sort.prototype.sort).to.be.a("function");
  });
});
