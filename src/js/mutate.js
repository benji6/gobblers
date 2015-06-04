const R = require('ramda');

const environment = require('./environment.js');
const movementAlgorithms = require('./movementAlgorithms.js');

module.exports = (gobbler) => {
	const evolutionPointProperties = [
		"v", "attackCoefficient", "defenceCoefficient", "photosynthesisCoefficient",
	];

	const mutateProperty = (property) => {
		const newProperty = property * (1 + (Math.random() - 0.5) * gobbler.mutationCoefficient);
		return property < 0 ? 0.000001 : newProperty;
	};

	R.forEach((property) => gobbler[property] = mutateProperty(gobbler[property]), evolutionPointProperties);

	const currentEvolutionPoints = R.sum(R.props(evolutionPointProperties, gobbler));
	const mutationEnforcementRatio = environment.maxEvolutionPoints / currentEvolutionPoints;
	currentEvolutionPoints > environment.maxEvolutionPoints &&
		R.forEach((property) => gobbler[property] *= mutationEnforcementRatio, evolutionPointProperties);

  gobbler.movementAlgorithm = Math.random() < Math.pow(gobbler.mutationCoefficient, 2) ?
    movementAlgorithms[Math.floor(Math.random() * movementAlgorithms.length)] :
    gobbler.movementAlgorithm;

  return gobbler;
};
