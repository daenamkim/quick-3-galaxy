// How can we use require here if it's frontend? We can thank webpack.
const Chart = require("chart.js");
const Quick3Sort = require("./class/Quick3Sort");
const sound = require("./util/sound");
const { shuffle } = require("./util/etc");
require("./index.css");

const MAX_SAMPLES = 1000;
const FADE_DELAY = 2000;
const BACKGROUND_NORMAL = "normal";
const BACKGROUND_BLACK = "black";
const BACKGROUND_SPACE = "space";
const HEADER_OFF = "off";
const HEADER_ON = "on";

let sortChart;
let sortCanvas;
let sortingSteps;
let backgroundSource;
let linesSource;
let stepIndex;
let timerId;

function removeLines() {
  const contentsDiv = document.getElementById("contents");
  if (linesSource) {
    contentsDiv.removeChild(linesSource);
  }
}

function addLines() {
  removeLines();
  const contentsDiv = document.getElementById("contents");
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

function setHeader(mode) {
  const header = document.getElementById("header");
  if (mode === HEADER_OFF) {
    header.setAttribute("class", "header-off");
  } else {
    header.removeAttribute("class");
  }
}

function setBodyBackground(what) {
  const body = document.body;

  switch (what) {
    case BACKGROUND_NORMAL:
      body.removeAttribute("class");
      break;
    case BACKGROUND_BLACK:
      body.setAttribute("class", "body-background-black");
      break;
    case BACKGROUND_SPACE:
      body.setAttribute("class", "body-background-image");
      break;
    default:
  }
}

function addStartButton() {
  const contentsDiv = document.getElementById("contents");
  const startButton = document.createElement("button");
  startButton.innerHTML = "PLAY";
  startButton.setAttribute("class", "action-button");
  startButton.addEventListener("click", () => {
    contentsDiv.removeChild(startButton);
    setHeader(HEADER_OFF);
    setBodyBackground(BACKGROUND_BLACK);
    setTimeout(() => {
      setBodyBackground(BACKGROUND_SPACE);
      timerId = setTimeout(performSorting, 0);
      backgroundSource = sound.play(sound.BACKGROUND);
    }, FADE_DELAY);
  });
  contentsDiv.appendChild(startButton);
}

function addResetButton() {
  const contentsDiv = document.getElementById("contents");
  const resetButton = document.createElement("button");
  resetButton.innerHTML = "RESET";
  resetButton.setAttribute("class", "action-button");
  resetButton.addEventListener("click", () => {
    contentsDiv.removeChild(resetButton);
    init();
  });
  contentsDiv.appendChild(resetButton);
}

function removeSortCanvas() {
  const contentsDiv = document.getElementById("contents");
  if (sortCanvas) {
    contentsDiv.removeChild(sortCanvas);
  }
}

function addSortCanvas() {
  const contentsDiv = document.getElementById("contents");
  sortCanvas = document.createElement("canvas");
  sortCanvas.setAttribute("class", "sort-chart");
  contentsDiv.appendChild(sortCanvas);
}

function initChart(data) {
  removeSortCanvas();
  addSortCanvas();

  if (!sortCanvas) {
    return;
  }

  const sortContext = sortCanvas.getContext("2d");
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
  stepIndex = 0;
  sortChart = null;
  sortingSteps = null;
  backgroundSource = null;
  linesSource = null;
  timerId = null;

  const samples = Array(MAX_SAMPLES)
    .fill(1)
    .map((item, stepIndex) => {
      return stepIndex + 1;
    });
  const shuffledSamples = shuffle(samples);
  const quick3Sort = new Quick3Sort(shuffledSamples);
  quick3Sort.sort();
  sortingSteps = quick3Sort.getSteps();

  initChart(shuffledSamples);
  addStartButton();
}

const performEnding = () => {
  sortChart.data.datasets.forEach((dataset) => {
    dataset.backgroundColor.pop();
  });
  sortChart.update();

  if (++stepIndex >= MAX_SAMPLES) {
    clearInterval(timerId);
    addResetButton();
  }
};

const performSorting = () => {
  sortingSteps[stepIndex].forEach(() => {
    sortChart.data.datasets.forEach((dataset) => {
      // It's weird because forEach of datasets is called once.
      dataset.data.pop();
      dataset.backgroundColor.pop();
    });
  });

  sortingSteps[stepIndex].forEach((sample) => {
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

  stepIndex++;
  if (stepIndex % 20 === 0) {
    addLines();
  }

  if (stepIndex >= sortingSteps.length) {
    stepIndex = 0;
    clearTimeout(timerId);
    sound.stop(backgroundSource);
    sound.play(sound.TADA);
    removeLines();
    setBodyBackground(BACKGROUND_BLACK);
    setHeader(HEADER_ON);
    setTimeout(() => {
      setBodyBackground(BACKGROUND_NORMAL);
    }, FADE_DELAY);
    timerId = setInterval(performEnding, 1);
  } else {
    timerId = setTimeout(performSorting, 1);
  }
};

init();
