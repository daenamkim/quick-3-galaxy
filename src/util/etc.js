const shuffle = (array) => {
  let result = [...array];
  for (let i = result.length - 1; i >= 0; i--) {
    let j = Math.floor(Math.random() * i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

module.exports = {
  shuffle,
};
