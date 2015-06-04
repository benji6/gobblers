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

module.exports = (gobbler) => {
	R.forEach(mutateProperty(gobbler), mutationCoefficientProperties);

	const currentEvolutionPoints = R.sum(R.props(evolutionPointProperties, gobbler));
	const mutationEnforcementRatio = environment.maxEvolutionPoints / currentEvolutionPoints;

	currentEvolutionPoints > environment.maxEvolutionPoints &&
		R.forEach((property) => gobbler[property] *= mutationEnforcementRatio, evolutionPointProperties);

  gobbler.movementAlgorithm = Math.random() < Math.pow(gobbler.mutationCoefficient, 2) ?
    movementAlgorithms[Math.floor(Math.random() * movementAlgorithms.length)] :
    gobbler.movementAlgorithm;

  gobbler.v = gobbler.v > environment.maximumSpeed ?
    environment.maximumSpeed : gobbler.v;

  return gobbler;
};
