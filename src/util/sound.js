const BACKGROUND = "background";
const LASER = "laser";
const TADA = "tada";
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffer = {};

function play(which) {
  const source = audioCtx.createBufferSource();
  const request = new XMLHttpRequest();
  request.open("GET", `/sound/${which}.mp3`);
  request.responseType = "arraybuffer";
  if (audioBuffer[which] === undefined) {
    request.onload = () => {
      audioCtx.decodeAudioData(
        request.response,
        (buffer) => {
          audioBuffer[which] = buffer;
          source.buffer = buffer;
          source.connect(audioCtx.destination);
          // source.loop = true;
        },
        (err) => {
          console.log(`Audio decoding error: ${err.err}`);
        }
      );
    };
    request.send();
  } else {
    source.buffer = audioBuffer[which];
  }
  source.connect(audioCtx.destination);
  source.start(0);
  return source;
}

function stop(source) {
  source.stop(0);
}

module.exports = {
  play,
  stop,
  BACKGROUND,
  LASER,
  TADA,
};
