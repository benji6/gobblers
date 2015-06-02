module.exports = ({
	energy, x, y, v, attackCoefficient, defenceCoefficient, photosynthesisCoefficient, generation
}) => ({
	attackCoefficient,
	defenceCoefficient,
	energy,
	generation,
	metabolism: 0.001,
	mutationCoefficient: 0.5,
	photosynthesisCoefficient,
	threshold: 12,
	v,
	x,
	y,
});
