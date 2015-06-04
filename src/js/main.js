const R = require('ramda');
const tinytic = require('tinytic');

const AnalysisView = require('./AnalysisView.jsx');
const calculateRadius = require('./calculateRadius.js');
const canvasView = require('./canvasView.js');
const createGobbler = require('./createGobbler.js');
const environment = require('./environment.js');
const stats = require('./stats.js');

var gobblers = [];
const analysisView = AnalysisView();

const calculateAttackStrength = ({attackCoefficient, energy}) => attackCoefficient * energy;
const calculateDefenceStrength = ({defenceCoefficient, energy}) => defenceCoefficient * energy;

const photosynthesize = (gobbler, environment) => {
	const energyProduced = gobbler.photosynthesisCoefficient * calculateRadius(gobbler) * environment.light() *
		environment.carbonDioxideLevel / environment.initialGobblersCount / 1000;
	gobbler.energy += energyProduced;
	environment.increaseAtmosphereOxygenComposition(energyProduced);
	return gobbler;
};

const attack = (gobbler0, gobbler1, stats) => {
	if (calculateAttackStrength(gobbler0) >= calculateDefenceStrength(gobbler1)) {
		stats.eatCount++;
		gobbler0.energy += gobbler1.energy;
		gobbler1.energy = 0;
	}
	return gobbler0;
};

const move = (gobbler, environment) => gobbler.movementAlgorithm(gobbler, environment);

const respire = (gobbler, environment) => {
	const energyUsed = gobbler.energy * gobbler.metabolism;

	gobbler.energy -= energyUsed;
	environment.increaseAtmosphereOxygenComposition(-energyUsed);

	return gobbler;
};

const reproduce = (gobbler, stats) => {
	if (gobbler.energy > gobbler.threshold) {
		stats.reproductionCount++;
		gobbler.generation++;
		const displacementRadius = calculateRadius(gobbler) * 2;
		const xDisplacement = (Math.random() - 0.5) * 2 * displacementRadius;
		const yDisplacement = Math.sqrt(Math.pow(displacementRadius,2) - Math.pow(xDisplacement,2));
		const gobblerParams = {
			x: gobbler.x - xDisplacement,
			y: gobbler.y - yDisplacement,
			energy: gobbler.energy / 2,
			v: gobbler.v,
			attackCoefficient: gobbler.attackCoefficient,
			defenceCoefficient: gobbler.defenceCoefficient,
			generation: gobbler.generation,
			photosynthesisCoefficient: gobbler.photosynthesisCoefficient,
			movementAlgorithm: gobbler.movementAlgorithm,
		};
		gobblers[gobblers.length] = createGobbler(gobblerParams);
		gobbler.x += xDisplacement;
		gobbler.y += yDisplacement;
		gobbler.energy = gobbler.energy / 2;
		mutate(gobbler);
		mutate(gobblers[gobblers.length - 1]);
		if (stats.intYoungestGen < gobbler.generation) {
			stats.intYoungestGen = gobbler.generation;
		}
	}
	return gobbler;
};

const mutate = (gobbler) => {
	const mutateProp = (prop) => {
		prop += prop * (Math.random() - 0.5) * gobbler.mutationCoefficient;
		if (prop < 0) {
			prop = 0.000001;
		}
		return prop;
	};
	gobbler.v = mutateProp(gobbler.v);
	gobbler.attackCoefficient = mutateProp(gobbler.attackCoefficient);
	gobbler.defenceCoefficient = mutateProp(gobbler.defenceCoefficient);
	gobbler.photosynthesisCoefficient = mutateProp(gobbler.photosynthesisCoefficient);
	//enforce restrictions
	var currentEvolutionPoints = gobbler.v + gobbler.attackCoefficient + gobbler.defenceCoefficient + gobbler.photosynthesisCoefficient;
	var mutationEnforcementRatio = environment.maxEvolutionPoints / currentEvolutionPoints;
	if (currentEvolutionPoints > environment.maxEvolutionPoints) {
		gobbler.v = gobbler.v * mutationEnforcementRatio;
		gobbler.attackCoefficient = gobbler.attackCoefficient * mutationEnforcementRatio;
		gobbler.defenceCoefficient = gobbler.defenceCoefficient * mutationEnforcementRatio;
		gobbler.photosynthesisCoefficient = gobbler.photosynthesisCoefficient * mutationEnforcementRatio;
	}
};

const removeDead = R.filter((gobbler) => {
	if (gobbler.energy < 0.1) {
		stats.deathCount++;
		environment.increaseAtmosphereOxygenComposition(-gobbler.energy);
		return false;
	}
	return true;
});

const checkPossibleContactX = (gobbler0, gobbler1) => {
	const x0 = gobbler0.x;
	const radius0 = calculateRadius(gobbler0);
	const x1 = gobbler1.x;
	const radius1 = calculateRadius(gobbler1);

	return x0 + radius0 >= x1 - radius1 && x0 - radius0 <= x1 + radius1;
};

const checkContact = (gobbler0, gobbler1) => {
	const x0 = gobbler0.x;
	const y0 = gobbler0.y;
	const radius0 = calculateRadius(gobbler0);
	const x1 = gobbler1.x;
	const y1 = gobbler1.y;
	const radius1 = calculateRadius(gobbler1);

	return Math.pow(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2), 0.5) <= radius0 + radius1;
};

//initial spawn
for (let i = 0; i < environment.initialGobblersCount; i++) {
	let gobblerParams = {
		x: 0,
		y: 0,
		energy: environment.initialGobblerEnergy,
		v: 1,
		attackCoefficient: 0.5,
		defenceCoefficient: 0.5,
		generation: 0,
		photosynthesisCoefficient: 1
	};
	gobblers[i] = createGobbler(gobblerParams);
	let radius = calculateRadius(gobblers[i]);
	gobblers[i].x = Math.random()*(canvasView.canvas.width-2* radius) + radius;
	gobblers[i].y = Math.random()*(canvasView.canvas.height-2* radius) + radius;
	mutate(gobblers[i]);
}

(function animationloop () {
	window.requestAnimationFrame(animationloop);
	stats.totalEnergy = 0;
	stats.intOldestGen = stats.intYoungestGen;
	stats.totalVelocityCoefficient = 0;
	stats.totalPhotosynthesisCoefficient = 0;
	stats.totalAttackCoefficient = 0;
	stats.totalDefenceCoefficient = 0;

	gobblers = R.sort((gobbler0, gobbler1) => gobbler0.x - gobbler1.x, gobblers);

	for (let i = 0; i < gobblers.length; i++) {
		let gobbler0 = gobblers[i];
		let j = i - 1;

		while (j >= 0 && checkPossibleContactX(gobbler0, gobblers[j])) {
			let gobbler1 = gobblers[j];
			if (checkContact(gobbler0, gobbler1)) {
				attack(gobbler0, gobbler1, stats);
			}
			j--;
		}
		j = i + 1;
		while (j < gobblers.length && checkPossibleContactX(gobbler0, gobblers[j])) {
			let gobbler1 = gobblers[j];
			if (checkContact(gobbler0, gobbler1)) {
				attack(gobbler0, gobbler1, stats);
			}
			j++;
		}

		respire(reproduce(move(photosynthesize(gobbler0, environment), environment), stats), environment);

		stats.totalEnergy += gobbler0.energy;
		stats.intOldestGen = stats.intOldestGen > gobbler0.generation ?
			gobbler0.generation :
			stats.intOldestGen;
		stats.totalVelocityCoefficient += gobbler0.v;
		stats.totalAttackCoefficient += gobbler0.attackCoefficient;
		stats.totalDefenceCoefficient += gobbler0.defenceCoefficient;
		stats.totalPhotosynthesisCoefficient += gobbler0.photosynthesisCoefficient;
	}

	gobblers = removeDead(gobblers);
	stats.totalGobblers = gobblers.length;
	analysisView.render({
		environment,
		stats,
		secondsElapsed: (tinytic.total() / 1000).toFixed(0),
	});

	canvasView.render({
		gobblers,
		lightLevel: (environment.light() * 255).toFixed(0),
		totalAttackCoefficient: stats.totalAttackCoefficient,
		totalDefenceCoefficient: stats.totalDefenceCoefficient,
		totalPhotosynthesisCoefficient: stats.totalPhotosynthesisCoefficient,
	});
}());
