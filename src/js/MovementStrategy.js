const movementAlgorithms = require('./movementAlgorithms.js');

module.exports = (gobbler, move) => {
  gobbler,
  move: move || movementAlgorithms[Math.floor(Math.random() * movementAlgorithms.length)],
};
