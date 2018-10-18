// How can we use require here if it's frontend? We can thank webpack.
const Chart = require("chart.js");
const Quick3Sort = require("./class/Quick3Sort");
const {
  playBackground,
  stopBackground,
  playLaser,
  playTada,
} = require("./util/sound");

// A link to our styles!
require("./index.css");

const sortContext = document.getElementById("sortChart").getContext("2d");
const samples = Array(1000)
  .fill(1)
  .map((item, index) => {
    return index + 1;
  });

// Suffle input samples.
for (let i = samples.length - 1; i >= 0; i--) {
  let j = Math.floor(Math.random() * i);
  [samples[i], samples[j]] = [samples[j], samples[i]];
}
const sort = new Quick3Sort(samples);
sort.sort();
let results = sort.getSteps();

const data = {
  datasets: [
    {
      data: samples,
    },
  ],
  // labels: Array(100).fill(1).map((item, index) => index),
};

const sortChart = new Chart(sortContext, {
  data: data,
  type: "polarArea",
  // options: options
});

let startIndex = 0;
let endIndex = results.length - 1;
sortChart.options.animation.animateRotate = false;
sortChart.options.animation.animateScale = false;
sortChart.update();
let player = playBackground();

const perform = () => {
  results[startIndex].forEach(() => {
    sortChart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
  });

  results[startIndex].forEach((sample) => {
    sortChart.data.datasets.forEach((dataset) => {
      dataset.data.push(sample);
    });
  });

  sortChart.update();
  playLaser();

  if (++startIndex > endIndex) {
    startIndex = 0;
    clearTimeout(timerId);
    stopBackground(player);
    playTada();
  } else {
    timerId = setTimeout(perform, 10);
  }
};
let timerId = setTimeout(perform, 2000);

// TODO: remove here later.
// function changeTitle(event) {
//   event.preventDefault();
//   // console.log('What is an event?', event);
// }

// const form = document.querySelector("form");
// document.addEventListener("DOMContentLoaded", () => {
//   form.onsubmit = changeTitle;
// });
