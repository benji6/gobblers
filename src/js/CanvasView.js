const R = require('ramda');

module.exports = function () {
  const canvas = document.querySelector("canvas");
  canvas.width = 512;
  canvas.height = canvas.width;
  const context = canvas.getContext('2d');

  return {
    canvas,
    render: function ({gobblers, lightLevel}) {
      context.fillStyle = `rgb(${lightLevel}, ${lightLevel}, ${lightLevel})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
      R.forEach((gobbler) => {
        context.fillStyle = gobbler.color();
        context.beginPath();
        context.arc(gobbler.x, gobbler.y, gobbler.radius(), 0, 2 * Math.PI, true);
        context.closePath();
        context.fill();
      }, gobblers);
    }
  };
};
