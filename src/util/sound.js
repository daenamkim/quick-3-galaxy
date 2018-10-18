function createAudio(file) {
  return `<audio autoplay>
  <source src="/sound/${file}.mp3" type="audio/mpeg">
  </audio>`;
}

function playBackground() {
  let player = document.createElement("background");
  player.innerHTML = createAudio("background");
  document.body.append(player);
  return player;
}

function stopBackground(player) {
  document.body.removeChild(player);
}

function playLaser() {
  let player = document.createElement("sound");
  player.innerHTML = createAudio("laser");
  document.body.append(player);
  return player;
  // FIXME: I know it's too bad.
  // document.body.removeChild(player);
}

function playTada() {
  let player = document.createElement("sound");
  player.innerHTML = createAudio("tada");
  // FIXME: I know it's too bad.
  document.body.append(player);
  return player;
}

module.exports = {
  playBackground,
  stopBackground,
  playLaser,
  playTada,
};
