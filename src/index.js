// How can we use require here if it's frontend? We can thank webpack.
const Chart = require("chart.js");
const Quick3Sort = require("./class/Quick3Sort");
const sound = require("./util/sound");
const { shuffle } = require("./util/etc");
const MAX_SAMPLES = 1000;
require("./index.css");

let sortChart;
let sortingSteps;
let backgroundSource;

function init() {
  const samples = Array(MAX_SAMPLES)
    .fill(1)
    .map((item, index) => {
      return index + 1;
    });
  const shuffledSamples = shuffle(samples);
  const quick3Sort = new Quick3Sort(shuffledSamples);
  quick3Sort.sort();
  sortingSteps = quick3Sort.getSteps();

  const sortContext = document.getElementById("sortChart").getContext("2d");
  const chartInitData = {
    datasets: [
      {
        backgroundColor: [],
        borderWidth: shuffledSamples.map(() => 0.1),
        data: shuffledSamples,
      },
    ],
    labels: [],
  };
  sortChart = new Chart(sortContext, {
    data: chartInitData,
    type: "polarArea",
    options: [],
  });

  // Disable animation effect after init.
  sortChart.options.animation.animateRotate = false;
  sortChart.options.animation.animateScale = false;
  sortChart.update();
}

let index = 0;
let timerId;
const performEnding = () => {
  sortChart.data.datasets.forEach((dataset) => {
    dataset.backgroundColor.pop();
  });
  sortChart.update();

  if (++index >= MAX_SAMPLES) {
    clearInterval(timerId);
  }
};

const performSorting = () => {
  sortingSteps[index].forEach(() => {
    sortChart.data.datasets.forEach((dataset) => {
      // It's weird because forEach of datasets is called once.
      dataset.data.pop();
      dataset.backgroundColor.pop();
    });
  });

  sortingSteps[index].forEach((sample) => {
    sortChart.data.datasets.forEach((dataset) => {
      dataset.data.push(sample);
      dataset.backgroundColor.push(
        `#${Math.floor(Math.random() * 65536).toString(16)}`
      );
    });
  });
  sortChart.update();
  sound.play(sound.LASER);

  if (++index >= sortingSteps.length) {
    index = 0;
    clearTimeout(timerId);
    sound.stop(backgroundSource);
    sound.play(sound.TADA);
    clearTimeout(timerId);
    timerId = setInterval(performEnding, 1);
  } else {
    timerId = setTimeout(performSorting, 1);
  }
};

// Let's go!
init();
backgroundSource = sound.play(sound.BACKGROUND);
timerId = setTimeout(performSorting, 2500);
