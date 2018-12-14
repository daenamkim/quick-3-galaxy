const BACKGROUND = "background";
const LASER = "laser";
const TADA = "tada";

function play(which) {
  const source = new Audio(`/sound/${which}.mp3`);
  source.play();
  return source;
}

function stop(source) {
  source.pause();
  source.currentTime = 0;
}

module.exports = {
  play,
  stop,
  BACKGROUND,
  LASER,
  TADA,
};
