const R = require('ramda');

const canvas = document.querySelector("canvas");
canvas.width = 512;
canvas.height = canvas.width;
const context = canvas.getContext('2d');

var calculateRadius = ({energy}) => Math.sqrt(energy);

module.exports = {
  canvas,
  render: function ({gobblers, lightLevel}) {
    context.fillStyle = `rgb(${lightLevel}, ${lightLevel}, ${lightLevel})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    R.forEach((gobbler) => {
      context.fillStyle = gobbler.color();
      context.beginPath();
      context.arc(gobbler.x, gobbler.y, calculateRadius(gobbler), 0, 2 * Math.PI, true);
      context.closePath();
      context.fill();
    }, gobblers);
  }
};
