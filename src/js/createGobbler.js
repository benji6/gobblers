module.exports = ({
	energy, x, y, v, attackCoefficient, defenceCoefficient, photosynthesisCoefficient, generation
}) => ({
	attackCoefficient: attackCoefficient,
	defenceCoefficient: defenceCoefficient,
	energy: energy,
	generation: generation,
	metabolism: 0.001,
	mutationCoefficient: 0.5,
	photosynthesisCoefficient: photosynthesisCoefficient,
	threshold: 12,
	v: v,
	x: x,
	y: y,
});
