const R = require('ramda');
const movementAlgorithms = require('./movementAlgorithms.js');
const plusOrMinus = require('./plusOrMinus.js');
const environment = require('./environment.js');

const mutationCoefficientProperties = [
  "v", "attackCoefficient", "defenceCoefficient", "photosynthesisCoefficient",
];

const evolutionPointProperties = [
  "attackCoefficient", "defenceCoefficient", "photosynthesisCoefficient",
];

const mutateProperty = R.curry((gobbler, propertyKey) => {
  const property = gobbler[propertyKey];
  const newProperty = property * (1 + (Math.random() - 0.5) * gobbler.mutationCoefficient);
  gobbler[propertyKey] = property < 0 ? 0.000001 : newProperty;
});

const calculateChildCoords = function () {
	const separationDist = 4 * this.calculateRadius();
	const {x, y} = this;
	if (x <= separationDist) {
		return {x: x + separationDist, y};
	}
	if (x >= environment.sideLength - separationDist) {
		return {x: x - separationDist, y};
	}
	if (y <= separationDist) {
		return {x, y: y + separationDist};
	}
	if (y >= environment.sideLength - separationDist) {
		return {x, y: y - separationDist};
	}
	const childXSeparation = 2 * (Math.random() - 0.5) * separationDist;
	return {
		x: x + childXSeparation,
		y: y + plusOrMinus(Math.pow(Math.pow(separationDist, 2) - Math.pow(childXSeparation, 2), 0.5)),
	};
};

class Gobbler {
	constructor ({
		energy, x, y, v, attackCoefficient, defenceCoefficient, photosynthesisCoefficient, generation, movementAlgorithm
	}) {
		this.attackCoefficient = attackCoefficient;
		this.defenceCoefficient = defenceCoefficient;
		this.energy = energy;
		this.generation = generation;
		this.metabolism = 0.001;
		this.movementAlgorithm = movementAlgorithm ||
			movementAlgorithms[Math.floor(Math.random() * movementAlgorithms.length)];
		this.mutationCoefficient = 0.5;
		this.photosynthesisCoefficient = photosynthesisCoefficient;
		this.threshold = 12;
		this.v = v;
		this.x = x;
		this.y = y;
	}

	calculateRadius () {
		return Math.sqrt(this.energy);
	}

	move (environment) {
		return this.movementAlgorithm(this, environment);
	}

	mutate () {
    R.forEach(mutateProperty(this), mutationCoefficientProperties);

  	const currentEvolutionPoints = R.sum(R.props(evolutionPointProperties, this));
  	const mutationEnforcementRatio = environment.maxEvolutionPoints / currentEvolutionPoints;

  	currentEvolutionPoints > environment.maxEvolutionPoints &&
  		R.forEach((property) => this[property] *= mutationEnforcementRatio, evolutionPointProperties);

    this.movementAlgorithm = Math.random() < Math.pow(this.mutationCoefficient, 2) ?
      movementAlgorithms[Math.floor(Math.random() * movementAlgorithms.length)] :
      this.movementAlgorithm;

    this.v = this.v > environment.maximumSpeed ?
      environment.maximumSpeed : this.v;

    return this;
	}

	photosynthesize (environment) {
		const energyProduced = this.photosynthesisCoefficient * this.calculateRadius() * environment.light() *
			environment.carbonDioxideLevel / environment.initialGobblersCount / 1000;
			this.energy += energyProduced;
		environment.increaseAtmosphereOxygenComposition(energyProduced);
		return this;
	}

	reproduce (stats, gobblers) {
		if (this.energy > this.threshold) {
			const childCoords = calculateChildCoords.call(this);
			stats.reproductionCount++;
			this.generation++;
			gobblers.push(new Gobbler({
				x: childCoords.x,
				y: childCoords.y,
				energy: this.energy / 2,
				v: this.v,
				attackCoefficient: this.attackCoefficient,
				defenceCoefficient: this.defenceCoefficient,
				generation: this.generation,
				photosynthesisCoefficient: this.photosynthesisCoefficient,
				movementAlgorithm: this.movementAlgorithm,
			}).mutate());
			this.energy = this.energy / 2;
			if (stats.intYoungestGen < this.generation) {
				stats.intYoungestGen = this.generation;
			}
		}
		return this;
	}

	respire (environment) {
		const energyUsed = this.energy * this.metabolism;
		this.energy -= energyUsed;
		environment.increaseAtmosphereOxygenComposition(-energyUsed);
		return this;
	}
}

module.exports = Gobbler;
