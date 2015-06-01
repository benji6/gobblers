const R = require('ramda');

const AnalysisView = require('./AnalysisView.js');
const canvasView = require('./canvasView.js');
const environment = require('./environment.js');
const stats = require('./stats.js');

const analysisView = AnalysisView();
var gobblers = [];

var i;
function Gobbler({
	energy, x, y, v, attackCoefficient, defenceCoefficient, photosynthesisCoefficient, generation
}) {
	this.attackCoefficient = attackCoefficient;
	this.defenceCoefficient = defenceCoefficient;
	this.energy = energy;
	this.generation = generation;
	this.metabolism = 0.001;
	this.mutationCoefficient = 0.5;
	this.photosynthesisCoefficient = photosynthesisCoefficient;
	this.threshold = 12;
	this.v = v;
	this.x = x;
	this.y = y;
}

const calculateRadius = ({energy}) => Math.sqrt(energy);
const calculateAttackStrength = ({attackCoefficient, energy}) => attackCoefficient * energy;
const calculateDefenceStrength = ({defenceCoefficient, energy}) => defenceCoefficient * energy;
const photosynthesize = (gobbler, environment) => {
	const energyProduced = gobbler.photosynthesisCoefficient * calculateRadius(gobbler) * environment.light() *
		environment.carbonDioxideLevel / environment.initialGobblersCount / 1000;
	gobbler.energy += energyProduced;
	environment.increaseAtmosphereOxygenComposition(energyProduced);
	return gobbler;
};

const move = (gobbler, environment) => {
	const speed = gobbler.v * gobbler.energy * environment.oxygenLevel / environment.initialGobblersCount;
	const radius = calculateRadius(gobbler);

	if (gobbler.x <= radius + speed) {
		gobbler.x += Math.random() / 2 * speed;
	} else {
		if (gobbler.x >= canvasView.canvas.width - radius - speed / 2) {
			gobbler.x -= Math.random() / 2 * speed;
		} else {
			gobbler.x += (Math.random() - 0.5) * speed;
		}
	}
	if (gobbler.y <= radius + speed) {
		gobbler.y += Math.random() / 2 * speed;
	} else {
		if (gobbler.y>=canvasView.canvas.height- radius -speed/2) {
			gobbler.y-=Math.random() / 2 * speed;
		} else {
			gobbler.y+=(Math.random() - 0.5) * speed;
		}
	}
	const energyUsed = gobbler.energy * speed / canvasView.canvas.width / 8;
	gobbler.energy -= energyUsed;
	environment.increaseAtmosphereOxygenComposition(-energyUsed);
	return gobbler;
};

const eat = (gobbler, gobblers, stats) => {
	for (var j = i + 1; j < gobblers.length; j++) {
		let thisGobblerRadius = calculateRadius(gobbler);
		let thatGobblerRadius = calculateRadius(gobblers[j]);
		if (gobbler.x>=gobblers[j].x - thatGobblerRadius - thisGobblerRadius &&
			gobbler.x<=gobblers[j].x+ thatGobblerRadius + thisGobblerRadius &&
			gobbler.y>=gobblers[j].y- thatGobblerRadius - thisGobblerRadius &&
			gobbler.y<=gobblers[j].y+ thatGobblerRadius + thisGobblerRadius) {
			if (calculateAttackStrength(gobbler) >= calculateDefenceStrength(gobblers[j])) {
				stats.eatCount++;
				gobbler.energy += gobblers[j].energy;
				gobblers[j].energy = 0;
				break;
			}
		}
	}
	return gobbler;
};

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
			photosynthesisCoefficient: gobbler.photosynthesisCoefficient
		};
		gobblers[gobblers.length] = new Gobbler(gobblerParams);
		gobbler.x += xDisplacement;
		gobbler.y += yDisplacement;
		gobbler.energy = gobbler.energy/2;
		mutate(gobbler);
		mutate(gobblers[gobblers.length - 1]);
		if (stats.intYoungestGen < gobbler.generation) {
			stats.intYoungestGen = gobblers[i].generation;
		}
	}
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

//initial spawn
for (i = 0; i < environment.initialGobblersCount; i++) {
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
	gobblers[i] = new Gobbler(gobblerParams);
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

	const removeDead = R.filter((gobbler) => {
		if (gobbler.energy < 0.1) {
			stats.deathCount++;
			environment.increaseAtmosphereOxygenComposition(-gobbler.energy);
			return false;
		}
		return true;
	});

	for (i=0; i < gobblers.length; i++) {
		reproduce(eat(move(photosynthesize(gobblers[i], environment), environment), gobblers, stats), stats);
		respire(gobblers[i], environment);
		stats.totalEnergy += gobblers[i].energy;
		stats.intOldestGen = stats.intOldestGen > gobblers[i].generation ?
			gobblers[i].generation :
			stats.intOldestGen;
		stats.totalVelocityCoefficient += gobblers[i].v;
		stats.totalAttackCoefficient += gobblers[i].attackCoefficient;
		stats.totalDefenceCoefficient += gobblers[i].defenceCoefficient;
		stats.totalPhotosynthesisCoefficient += gobblers[i].photosynthesisCoefficient;
	}

	gobblers = removeDead(gobblers);
	stats.totalGobblers = gobblers.length;
	analysisView.render({
		environment,
		stats,
	});

	canvasView.render({
		gobblers,
		lightLevel: (environment.light() * 255).toFixed(0),
		totalAttackCoefficient: stats.totalAttackCoefficient,
		totalDefenceCoefficient: stats.totalDefenceCoefficient,
		totalPhotosynthesisCoefficient: stats.totalPhotosynthesisCoefficient,
	});
}());
