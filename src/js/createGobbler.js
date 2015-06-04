const movementAlgorithms = require('./movementAlgorithms.js');

module.exports = ({
	energy, x, y, v, attackCoefficient, defenceCoefficient, photosynthesisCoefficient, generation, movementAlgorithm
}) => ({
	attackCoefficient,
	defenceCoefficient,
	energy,
	generation,
	metabolism: 0.001,
	movementAlgorithm: movementAlgorithm || movementAlgorithms[Math.floor(Math.random() * movementAlgorithms.length)],
	mutationCoefficient: 0.5,
	photosynthesisCoefficient,
	threshold: 12,
	v,
	x,
	y,
});
