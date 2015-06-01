const R = require('ramda');

const canvas = document.querySelector("canvas");
canvas.width = window.innerHeight > window.innerWidth ?
  window.innerWidth :
  window.innerHeight;
canvas.height = canvas.width;
const context = canvas.getContext('2d');

const calculateRadius = ({energy}) => Math.sqrt(energy);
const calculateColor = (totalGobblers, totalAttackCoefficient, totalDefenceCoefficient, totalPhotosynthesisCoefficient, {
  attackCoefficient, defenceCoefficient, photosynthesisCoefficient
}) => `rgb(${(attackCoefficient / totalAttackCoefficient * totalGobblers * 127).toFixed(0)},
    ${(defenceCoefficient / totalDefenceCoefficient * totalGobblers * 127).toFixed(0)},
    ${(photosynthesisCoefficient / totalPhotosynthesisCoefficient * totalGobblers * 127).toFixed(0)})`;

module.exports = {
  canvas,
  render: function ({gobblers, lightLevel, totalAttackCoefficient, totalDefenceCoefficient, totalPhotosynthesisCoefficient}) {
    context.fillStyle = `rgb(${lightLevel}, ${lightLevel}, ${lightLevel})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    R.forEach((gobbler) => {
      context.fillStyle = calculateColor(gobblers.length, totalAttackCoefficient, totalDefenceCoefficient, totalPhotosynthesisCoefficient, gobbler);
      context.beginPath();
      context.arc(gobbler.x, gobbler.y, calculateRadius(gobbler), 0, 2 * Math.PI, true);
      context.closePath();
      context.fill();
    }, gobblers);
  }
};
