/* Example Code
      The following is just some example code for you to play around with.
      No need to keep this---it's just some code so you don't feel too lonely.
*/

// How can we use require here if it's frontend? We can thank webpack.
const Sort = require("./Quick3Sort");

// A link to our styles!
require("./index.css");

const sort = new Sort();
const result = sort.sort();
let samples = Array(100)
  .fill(1)
  .map((item, index) => {
    return index + 1;
  });

// Suffle samples.
for (let i = samples.length; i > 0; i--) {
  let j = Math.floor(Math.random() * (i + 1));
  [samples[i], samples[j]] = [samples[j], samples[i]];
}

function createCheesyTitle(slogan) {
  const container = document.createElement("h1");
  const textNode = document.createTextNode(slogan);
  container.appendChild(textNode);
  return container;
}

const title = createCheesyTitle(sort.returnValue("Re-Engineer Yourself"));
document.getElementById("title").appendChild(title);

const resultView = document.getElementById("result");
resultView.appendChild(document.createTextNode(JSON.stringify(samples)));

/*
    An simple example of how you can make your project a bit more
    interactive, if you would like.

    In our `index.html` page, we have a short form.
    Here is the code that talks to it.
  */
function changeTitle(event) {
  event.preventDefault();
  // console.log('What is an event?', event);
}

const form = document.querySelector("form");
document.addEventListener("DOMContentLoaded", () => {
  form.onsubmit = changeTitle;
});
