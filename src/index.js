// How can we use require here if it's frontend? We can thank webpack.
const Chart = require("chart.js");
const Quick3Sort = require("./class/Quick3Sort");
const sound = require("./util/sound");
const { shuffle } = require("./util/etc");
const MAX_SAMPLES = 1000;
const FADE_DELAY = 3000;
require("./index.css");

let sortChart;
let sortingSteps;
let backgroundSource;
let linesSource;

function removeLines() {
  const contentsDiv = document.getElementById("contents");

  if (linesSource) {
    contentsDiv.removeChild(linesSource);
  }
}

function createLines() {
  const contentsDiv = document.getElementById("contents");

  if (linesSource) {
    contentsDiv.removeChild(linesSource);
  }

  const linesDiv = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  linesDiv.setAttribute("id", "lines");
  linesDiv.setAttribute("width", "100%");
  linesDiv.setAttribute("height", "1000");
  for (let i = 0; i < 10; i++) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("stroke-width", Math.floor(Math.random() * 10));
    line.setAttribute("stroke-dasharray", Math.floor(Math.random() * 150) + 50);
    line.setAttribute(
      "stroke",
      `#${Math.random() > 0.5 ? "f00" : "0f0"}${Math.floor(
        Math.random() * 16
      ).toString(16)}`
    );
    line.setAttributeNS(null, "x1", Math.floor(Math.random() * 1000));
    line.setAttributeNS(null, "x2", Math.floor(Math.random() * 2000));
    line.setAttributeNS(null, "y1", Math.floor(Math.random() * 1000));
    line.setAttributeNS(null, "y2", Math.floor(Math.random() * 2000));
    line.setAttributeNS(null, "class", "line");
    linesDiv.appendChild(line);
  }
  contentsDiv.appendChild(linesDiv);
  linesSource = linesDiv;
}

function initStartButton() {
  // FIXME: CSS
  const contentsDiv = document.getElementById("contents");
  const startButton = document.createElement("button");
  startButton.innerHTML = "PLAY";
  startButton.setAttribute("class", "start-button");
  startButton.addEventListener("click", () => {
    startButton.setAttribute("style", "display: none");
    const body = document.body;
    body.setAttribute("class", "body-background-black");
    setTimeout(() => {
      body.setAttribute("class", "body-background-image");
      timerId = setTimeout(performSorting, 0);
      backgroundSource = sound.play(sound.BACKGROUND);
    }, FADE_DELAY);
  });
  contentsDiv.appendChild(startButton);
}

function initChart(data) {
  const sortContext = document.getElementById("sortChart").getContext("2d");
  const chartInitData = {
    datasets: [
      {
        backgroundColor: [],
        borderWidth: data.map(() => 0.1),
        data,
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

  initChart(shuffledSamples);
  initStartButton();
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
        // #ffff /* r,g,b,a */
        `#${Math.floor(Math.random() * 65535).toString(16)}`
      );
    });
  });
  sortChart.update();
  sound.play(sound.LASER);

  index++;
  if (index % 20 === 0) {
    createLines();
  }

  if (index >= sortingSteps.length) {
    removeLines();
    clearTimeout(timerId);
    index = 0;
    sound.stop(backgroundSource);
    sound.play(sound.TADA);
    const body = document.body;
    body.setAttribute("class", "body-background-black");
    setTimeout(() => {
      body.removeAttribute("class");
    }, FADE_DELAY);
    timerId = setInterval(performEnding, 1);
  } else {
    timerId = setTimeout(performSorting, 1);
  }
};

init();
