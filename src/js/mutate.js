const R = require('ramda');

const environment = require('./environment.js');
const movementAlgorithms = require('./movementAlgorithms.js');

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

module.exports = function () {
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
};
