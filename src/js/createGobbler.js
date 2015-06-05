const movementAlgorithms = require('./movementAlgorithms.js');
const mutate = require('./mutate.js');

const calculateRadius = function () {
	return Math.sqrt(this.energy);
};

const move = function (environment) {
	return this.movementAlgorithm(this, environment);
};

const photosynthesize = function (environment) {
	const energyProduced = this.photosynthesisCoefficient * this.calculateRadius() * environment.light() *
		environment.carbonDioxideLevel / environment.initialGobblersCount / 1000;
		this.energy += energyProduced;
	environment.increaseAtmosphereOxygenComposition(energyProduced);
	return this;
};

const reproduce = function (stats, gobblers) {
	if (this.energy > this.threshold) {
		stats.reproductionCount++;
		this.generation++;
		const displacementRadius = this.calculateRadius() * 2;
		const xDisplacement = (Math.random() - 0.5) * 2 * displacementRadius;
		const yDisplacement = Math.sqrt(Math.pow(displacementRadius,2) - Math.pow(xDisplacement,2));
		const gobblerParams = {
			x: this.x - xDisplacement,
			y: this.y - yDisplacement,
			energy: this.energy / 2,
			v: this.v,
			attackCoefficient: this.attackCoefficient,
			defenceCoefficient: this.defenceCoefficient,
			generation: this.generation,
			photosynthesisCoefficient: this.photosynthesisCoefficient,
			movementAlgorithm: this.movementAlgorithm,
		};
		gobblers[gobblers.length] = createGobbler(gobblerParams);
		this.x += xDisplacement;
		this.y += yDisplacement;
		this.energy = this.energy / 2;
		mutate(this);
		mutate(gobblers[gobblers.length - 1]);
		if (stats.intYoungestGen < this.generation) {
			stats.intYoungestGen = this.generation;
		}
	}
	return this;
};

const respire = function (environment) {
	const energyUsed = this.energy * this.metabolism;
	this.energy -= energyUsed;
	environment.increaseAtmosphereOxygenComposition(-energyUsed);
	return this;
};

const createGobbler = ({
	energy, x, y, v, attackCoefficient, defenceCoefficient, photosynthesisCoefficient, generation, movementAlgorithm
}) => ({
	attackCoefficient,
	calculateRadius,
	defenceCoefficient,
	energy,
	generation,
	metabolism: 0.001,
	move,
	movementAlgorithm: movementAlgorithm || movementAlgorithms[Math.floor(Math.random() * movementAlgorithms.length)],
	mutationCoefficient: 0.5,
	photosynthesisCoefficient,
	photosynthesize,
	reproduce,
	respire,
	threshold: 12,
	v,
	x,
	y,
});

module.exports = createGobbler;
