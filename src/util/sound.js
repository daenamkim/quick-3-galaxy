const BACKGROUND = "background";
const LASER = "laser";
const TADA = "tada";

function createAudio(file) {
  // FIXME: without opening Chrome's debug console, sound couldn't be played. why?
  const player = document.createElement("sound");
  player.innerHTML = `<audio autoplay>
    <source src="/sound/${file}.mp3" type="audio/mpeg">
    </audio>`;
  document.body.append(player);
  return player;
}

function stop(player) {
  document.body.removeChild(player);
}

function play(which) {
  return createAudio(which);
}

module.exports = {
  play,
  stop,
  BACKGROUND,
  LASER,
  TADA,
};
